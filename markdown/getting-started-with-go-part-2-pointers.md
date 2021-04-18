---- /getting-started-with-go-part-2-pointers ----
title: Getting started with Go - Part 2 - Pointers
image: images/ladybug.jpg
date: 2021-04-18
template: post
metap-og;title: Getting started with Go - Part 2 - Pointers
metap-og;image: https://jldec.me/images/ladybug.jpg
metap-og;type: article
metap-og;url: https://jldec.me/getting-started-with-go-part-2-pointers
metap-og;description: My experience as a new user of Go, featuring first encounters with pointers
meta-twitter;site: @jldec
meta-twitter;creator: @jldec
meta-twitter;title: Getting started with Go - Part 2 - Pointers
meta-twitter;description: My experience as a new user of Go, featuring first encounters with pointers
meta-twitter;card: summary_large_image
meta-twitter;widgets;new-embed-design: on
meta-twitter;image: https://jldec.me/images/ladybug.jpg
meta-twitter;image;alt: Ladybug in Cambridge UK

## Golang

This is part 2 of my experience as a new user of Go, featuring first encounters with pointers. For part 1, see [Getting started with Go](/getting-started-with-go).

## Pointers

The [shortscale](https://github.com/jldec/shortscale-go/blob/main/shortscale.go) package which I covered last time, uses a string [Builder](https://pkg.go.dev/strings#Builder). Here is the example from the Builder docs. When you run it, it will output: _3...2...1...ignition_.

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	var b strings.Builder
	for i := 3; i >= 1; i-- {
		fmt.Fprintf(&b, "%d...", i)
	}
	b.WriteString("ignition")
	fmt.Println(b.String())
}
```

Notice that `var b` is an instance of the Builder.

## Pointer receiver methods and interfaces

The first argument to fmt.Fprintf is `&b`, a [pointer](https://tour.golang.org/moretypes/1) to b. This is necessary, because Fprintf expects an [io.Writer](https://pkg.go.dev/io#Writer) interface which is satisfied by the [Builder.Write](https://pkg.go.dev/strings#Builder.Write) method which has a `*Builder` pointer receiver.

I was tempted to replace `Fprintf(&b, ...)` with `Fprintf(b, ...)`, to make it more consistent with the `b.WriteString` and `b.String` Builder method calls further down, but doing this causes the compiler to complain:

_cannot use b (type strings.Builder) as type io.Writer in argument to fmt.Fprintf:  
strings.Builder does not implement io.Writer (Write method has pointer receiver)_

## Value vs. pointer function arguments

What if, instead of depending on the Writer interface, we called our own `write()` function?

```go
func main() {
	var b strings.Builder
	for i := 3; i >= 1; i-- {
		write(b, fmt.Sprintf("%d...", i))
	}
	b.WriteString("ignition")
	fmt.Println(b.String())
}

func write(b strings.Builder, s string) {
	b.WriteString(s)
}
```

Running the code above in the [example sandbox](https://pkg.go.dev/strings#Builder) outputs just the word _ignition_.

This suggests that the 3 calls to `write(b)` did not actually modify b, which makes sense, because passing a struct to a function [copies](https://tour.golang.org/methods/4) the struct value instead of passing a reference to it.

To fix this, we have to use a pointer argument, which means that we also have to invoke the function with `write(&b, ...)`. This works, but doesn't make the code any more consistent.

```go
func main() {
	var b strings.Builder
	for i := 3; i >= 1; i-- {
		write(&b, fmt.Sprintf("%d...", i))
	}
	b.WriteString("ignition")
	fmt.Println(b.String())
}

func write(b *strings.Builder, s string) {
	b.WriteString(s)
}
```

## Why do the method calls work?

Why are we allowed to use `b` instead of `&b` in front of [b.WriteString](https://pkg.go.dev/strings#Builder.WriteString) and [b.String](https://pkg.go.dev/strings#Builder.String)? This is explained in [the tour](https://tour.golang.org/methods/6) as well.

_"...even though v is a value and not a pointer, the method with the pointer receiver is called automatically. That is, as a convenience, Go interprets the statement v.Scale(5) as (&v).Scale(5) since the Scale method has a pointer receiver."_

## Start with a pointer

If all this mixing of values and pointers feels inconsistent, why not start with a pointer from the beginning?

The following code will compile just fine, but can you tell what's wrong with it?

```go
func main() {
	var b *strings.Builder
	for i := 3; i >= 1; i-- {
		fmt.Fprintf(b, "%d...", i)
	}
	b.WriteString("ignition")
	fmt.Println(b.String())
}
```
The declaration above results in a nil pointer panic at run time, because b is uninitialized.

> _panic: runtime error: invalid memory address or nil pointer dereference  
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x4991c7]_

## Create the Builder with new()

```go
func main() {
	b := new(strings.Builder)
	for i := 3; i >= 1; i-- {
		fmt.Fprintf(b, "%d...", i)
	}
	b.WriteString("ignition")
	fmt.Println(b.String())
}
```

`new(strings.Builder)` returns a pointer to a freshly allocated Builder, which we can use for both functions and pointer receiver methods. This is pattern I finally opted for in [shortscale-go](https://github.com/jldec/shortscale-go/blob/2485be23ef48660d8913b2ac884030220dc82d74/shortscale.go#L17-L24).

NOTE: The more explicit [struct literal](https://tour.golang.org/moretypes/5) syntax is equivalent to new() in this case.

```go
func main() {
	b := &strings.Builder{}
	...
```

> There's no avoiding pointers in Go.  
> Learn the quirks and the gotchas today.  
> ✨ Keep learning! ✨

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/getting-started-with-go-part-2-pointers-4a47)_

---- #excerpt ----

Part 2 of my experience as a new user of Go, featuring first encounters with pointers.