---- /getting-started-with-go-part-3-goroutines-and-channels ----
title: Getting started with Goroutines and channels
image: images/grape-hyacinth.jpg
date: 2021-04-25
template: post
metap-og;title: Getting started with Goroutines and channels
metap-og;image: https://jldec.me/images/grape-hyacinth.jpg
metap-og;type: article
metap-og;url: https://jldec.me/getting-started-with-go-part-3-goroutines-and-channels
metap-og;description: My experience as a new user of Goroutines and channels
meta-twitter;site: @jldec
meta-twitter;creator: @jldec
meta-twitter;title: Getting started with Goroutines and channels
meta-twitter;description: My experience as a new user of Goroutines and channels
meta-twitter;card: summary_large_image
meta-twitter;widgets;new-embed-design: on
meta-twitter;image: https://jldec.me/images/grape-hyacinth.jpg
meta-twitter;image;alt: Ladybug in Cambridge UK

## Golang

This is part 3 of my experience as a new user of Go, focusing on concurrency with Goroutines and channels.

For installation, testing, and packages, see [Getting started with Go](/getting-started-with-go), and for pointers see [Getting started with Go pointers](/getting-started-with-go-part-2-pointers).

## Counting HTTP requests

The [server](https://github.com/jldec/racey-go/blob/main/main.go) below counts HTTP requests, and returns the latest count on each request. 

_To follow along, clone https://github.com/jldec/racey-go, and start the server with 'go run .'_

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	var count uint64 = 0

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		count++
		fmt.Fprintln(w, count)
	})

	fmt.Println("Go listening on port 3000")
	http.ListenAndServe(":3000", nil)
}
```

```sh
$ curl localhost:3000
1
$ curl localhost:3000
2
```

Let's try sending multiple requests at the same time. This command invokes curl with urls from a file using xargs to spawn 4 processes at once.

```sh
$ cat urls.txt | xargs -P 4 -n 1 curl
```

The file contains 100 lines, but instead of ending on a nice round number, on systems with more than 1 core you may see  something like this (e.g. after 3 runs)

```
289
292
291
```

Replace the Go server with '[node server.js](https://github.com/jldec/racey-go/blob/main/server.js)' to compare the results (e.g. after 3 runs again)

```
298
299
300
```

Now repeat the experiment with the [race detector](https://golang.org/doc/articles/race_detector) turned on. The detector will report a problem on [line 12](https://github.com/jldec/racey-go/blob/main/main.go#L12) of main.go which is `count++`.

```sh
$ go run -race .
Go listening on port 3000
==================
WARNING: DATA RACE
Read at 0x00c000138280 by goroutine 7:
  main.main.func1()
      /Users/jleschner/pub/racey-go/main.go:12 +0x4a
  net/http.HandlerFunc.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2069 +0x51
  net/http.(*ServeMux).ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2448 +0xaf
  net/http.serverHandler.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2887 +0xca
  net/http.(*conn).serve()
      /Users/jleschner/go1.16.3/src/net/http/server.go:1952 +0x87d

Previous write at 0x00c000138280 by goroutine 9:
  main.main.func1()
      /Users/jleschner/pub/racey-go/main.go:12 +0x64
  net/http.HandlerFunc.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2069 +0x51
  net/http.(*ServeMux).ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2448 +0xaf
  net/http.serverHandler.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2887 +0xca
  net/http.(*conn).serve()
      /Users/jleschner/go1.16.3/src/net/http/server.go:1952 +0x87d
```

## Data races

From the [race detector](https://golang.org/doc/articles/race_detector) docs:

_A data race occurs when two goroutines access the same variable concurrently and at least one of the accesses is a write._

> It's clear that 'count++' modifies the count, but what are goroutines and where are they in this case?

## Goroutines

Let's start with an example.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan string)

	// start 2 countdowns in parallel goroutines
	go countdown("crew-1", ch)
	go countdown("crew-2", ch)

	fmt.Println(<-ch) // block waiting to receive 1st string
	fmt.Println(<-ch) // block waiting to receive 2nd string
}

func countdown(name string, ch chan<- string) {
	for i := 10; i > 0; i-- {
		fmt.Println(name, i)
		time.Sleep(1 * time.Second)
	}
	ch <- "blastoff " + name
}
```

Each 'go countdown()' starts a new [goroutine](https://tour.golang.org/concurrency/1). Notice how the countdowns are interleaved in the output.

```
...
crew-1 3
crew-2 3
crew-1 2
crew-2 2
crew-2 1
crew-2 1
blastoff crew-2
blastoff crew-1
```

The Go runtime can schedule many concurrent goroutines across a small number of OS threads. Under the covers, this is how the [http](https://golang.org/src/net/http/server.go#L3013) library handles concurrent web requests.

## Channels

[Channels](https://tour.golang.org/concurrency/2) allow goroutines to communicate and coordinate.

In the example above, `<-ch` (receive) will block until another goroutine uses `ch <-` to send a string to the channel. This happens at the end of each countdown.

Sends will also block if there are no receivers, but that is not the case here.

There are many other variations for how to use channels, including [buffered channels](https://tour.golang.org/concurrency/3) which only block sends when the buffer is full.

## Atomicity

Given that [net/http](https://pkg.go.dev/net/http) requests are handled by goroutines, can we explain why there is a data race when the function which handles a request increments a shared counter?

The reason is that `count++` requires a read followed by write, and these are not automatically synchronized. One goroutine may overwrite the increment of another, resulting in lost writes.

To fix this, the counter has be protected to make the increment operation atomic.

How to do this will be the topic of my next blog post, but for the impatient, I have already published https://github.com/jldec/counter-go.

> 🚀 - code safe - 🚀

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/getting-started-with-goroutines-and-channels-fc6)_

---- #excerpt ----

Part 3 in my learning Go series, focusing on concurrency with Goroutines and channels.
