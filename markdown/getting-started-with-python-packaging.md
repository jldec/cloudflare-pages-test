---- /getting-started-with-python-packaging ----
alias: /getting-started-with-python
title: Getting started with Python Packaging
image: /images/rockford-office.jpg
date: 2023-02-22
template: post
metap-og;title: Getting started with Python Packaging
metap-og;image: https://jldec.me/images/rockford-office.jpg
metap-og;type: article
metap-og;url: https://jldec.me/getting-started-with-python
metap-og;description: From zero to publishing a Python module on pypi.org.
meta-twitter;site: @jldec
meta-twitter;creator: @jldec
meta-twitter;title: Getting started with Python Packaging
meta-twitter;description: From zero to publishing a Python module on pypi.org.
meta-twitter;card: summary_large_image
meta-twitter;widgets;new-embed-design: on
meta-twitter;image: https://jldec.me/images/rockford-office.jpg
meta-twitter;image;alt: View from Rockford Manor Dublin

## Let's do some Python

In preparation for using a lot more Python, I decided to refresh my Python knowedge and publish my first Python module at https://pypi.org/project/shortscale/.

Some readers may recognize [shortscale](https://jldec.me/forays-from-node-to-rust) from earlier explorations in [JavaScript](https://github.com/jldec/shortscale), [Rust](https://github.com/jldec/shortscale-rs), and [Go](https://github.com/jldec/shortscale-go).

This post covers the following steps:

1. Install Python on macOS
2. Write the skeleton code, with just a one-line function.
3. Build and publish the incomplete [v0.1](https://github.com/jldec/shortscale-py/tree/bb9b026b9097ce9c601e632a9d1f74a7da6adf29) module.
4. Complete the logic [v1.0.0](https://github.com/jldec/shortscale-py/commit/6ab4a4b541590a60ebe2944473094465ba8f14f5).
5. Benchmarks

## Install python v3.10 (the hard way)

Installing Python on macOS is easiest with [the official installer](https://www.python.org/downloads/macos/) or [with homebrew](https://realPython.com/installing-python/#how-to-install-from-homebrew). 

I wanted a way to switch between Python versions, so I followed the instructions for [pyenv](https://github.com/pyenv/pyenv). 

NOTE: This does a full local build of CPython, and requires dependencies different from the macOS command line tools.

```
# 1. Install pyenv 
# from https://github.com/pyenv/pyenv#set-up-your-shell-environment-for-pyenv
git clone https://github.com/pyenv/pyenv.git $HOME/.pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"

# 2. Fix dependencies for macOS 
# from https://github.com/pyenv/pyenv/wiki#suggested-build-environment
brew install openssl readline sqlite3 xz zlib tcl-tk

# 3. After the brew install, fix LDFLAGS, CPPFLAGS and add tcl-tk/bin onto PATH 
export LDFLAGS="$LDFLAGS -L$HOME/homebrew/opt/openssl@3/lib -L$HOME/homebrew/opt/readline/lib -L$HOME/homebrew/opt/sqlite/lib -L$HOME/homebrew/opt/zlib/lib -L$HOME/homebrew/opt/tcl-tk/lib -L$HOME/homebrew/opt/openssl@3/lib -L$HOME/homebrew/opt/readline/lib -L$HOME/homebrew/opt/sqlite/lib -L$HOME/homebrew/opt/zlib/lib -L$HOME/homebrew/opt/tcl-tk/lib"
export CPPFLAGS="$CPPFLAGS -I$HOME/homebrew/opt/openssl@3/include -I$HOME/homebrew/opt/readline/include -I$HOME/homebrew/opt/sqlite/include -I$HOME/homebrew/opt/zlib/include -I$HOME/homebrew/opt/tcl-tk/include -I$HOME/homebrew/opt/openssl@3/include -I$HOME/homebrew/opt/readline/include -I$HOME/homebrew/opt/sqlite/include -I$HOME/homebrew/opt/zlib/include -I$HOME/homebrew/opt/tcl-tk/include"
export PATH=$HOME/homebrew/opt/tcl-tk/bin:$PATH

# 4. Use pyenv to build and install python v3.10 and make it the global default
pyenv install 3.10
pyenv global 3.10

# Point to the installed version in  .bash_profile (instead of depending on the pyenv shim)
export PATH=$HOME/.pyenv/versions/3.10.9/bin:$PATH
```

## Virtual environments and pip

Python [modules](https://docs.python.org/3/tutorial/modules.html) and their dependencies can be installed from [pypi.org](https://pypi.org/) using `pip install`.

Configuring a [virtual environment](https://docs.python.org/3/library/venv.html) will isolate modules under a `.venv` directory, which is easy to clean up, rather than installing everything globally.

I created a venv under my home directory using the following command

```sh
python3 -m venv ~/.venv
```

Instead of "activating" the venv, which changes the prompt, I prefer to prepend it directly onto my PATH for now.

```
export PATH=$HOME/.venv/bin:$PATH
export VIRTUAL_ENV=$HOME/.venv
```

## Create a new module called shortscale

First I wrote a skeleton `shortscale` function which just returns a string with the input.

The rest of the code is boilerplate, to make the function callable on the command line. Passing base=0 to [int()](https://docs.python.org/3/library/functions.html#int) enables numeric literal input with different bases. 

#### shortscale.py
```py
"""English conversion from number to string"""
import sys

__version__ = "0.1.0"

def shortscale(num: int) -> str:
  return '{} ({} bits)'.format(num, num.bit_length())

def main():
  if len(sys.argv) < 2:
    print ('Usage: shortscale num')
    sys.exit(1)

  print(shortscale(int(sys.argv[1],0)))
  sys.exit(0)

if __name__ == '__main__':
  main()

```

The output looks like this:

```sh
$ python shortscale.py 0x42
66 (7 bits)
```

Next, I built and published this incomplete [v0.1](https://github.com/jldec/shortscale-py/tree/bb9b026b9097ce9c601e632a9d1f74a7da6adf29) shortscale module.

Unlike the npm JavaScript ecosystem, you can't just use pip to publish a module to the pypi repository. There are [different build tools](https://packaging.python.org/en/latest/tutorials/packaging-projects/#creating-pyproject-toml) to choose from.

I chose `setuptools` because it appears to be the closest to a standard, and shows what it's doing. This meant installing [build](https://pypi.org/project/build/) and [twine](https://pypi.org/project/build/).   

Python packages are described in a `pyproject.toml`. Note that project.scripts points to the CLI entrypoint at main().

#### pyproject.toml
```toml
[project]
name = "shortscale"
description = "English conversion from number to string"
authors = [{name = "Jürgen Leschner", email = "jldec@users.noreply.github.com"}]
readme = "README.md"
license = {file = "LICENSE"}
classifiers = ["License :: OSI Approved :: MIT License"]
dynamic = ["version"]

[project.urls]
Home = "https://github.com/jldec/shortscale-py"

[project.scripts]
shortscale = "shortscale:main"

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[tool.setuptools.dynamic]
version = {attr = "shortscale.__version__"}
```

### Build the module
The build tool creates 2 module bundles (source and runnable code) in the ./dist directory.

```
$ python -m build
...
discovered py_modules -- ['shortscale']
...
creating '/Users/jldec/pub/shortscale-py/dist/.tmp-d0g4dwyd/shortscale-0.1.0-py3-none-any.whl' and adding 'build/bdist.macosx-13.1-arm64/wheel' to it
adding 'shortscale.py'
adding 'shortscale-0.1.0.dist-info/LICENSE'
adding 'shortscale-0.1.0.dist-info/METADATA'
adding 'shortscale-0.1.0.dist-info/WHEEL'
adding 'shortscale-0.1.0.dist-info/entry_points.txt'
adding 'shortscale-0.1.0.dist-info/top_level.txt'
adding 'shortscale-0.1.0.dist-info/RECORD'
removing build/bdist.macosx-13.1-arm64/wheel
Successfully built shortscale-0.1.0.tar.gz and shortscale-0.1.0-py3-none-any.whl
```

### Publish to pypi.org
```
$ python -m twine upload dist/*
Uploading distributions to https://upload.pypi.org/legacy/
Uploading shortscale-0.1.0-py3-none-any.whl
Uploading shortscale-0.1.0.tar.gz
...
View at:
https://pypi.org/project/shortscale/0.1.0/
```

## Install and run in a venv

The moment of truth. Install the module in a new venv, and invoke it.

```sh
$ mkdir test
$ cd test
$ python -m venv .venv
$ source .venv/bin/activate

(.venv) $ pip install shortscale
Collecting shortscale
  Using cached shortscale-0.1.0-py3-none-any.whl (3.8 kB)
Installing collected packages: shortscale
Successfully installed shortscale-0.1.0

(.venv) $ shortscale 0xffffffffffff
281474976710655 (48 bits)

$ deactivate
$ 
```

## Complete the logic

Python still amazes me with its terseness and readability. 

The code ended up needing [3 functions](https://github.com/jldec/shortscale-py/blob/main/shortscale.py), of which the longest is 30 lines with generous spacing. 

Here is the function which decomposes a number into powers of 1000. I wonder if this could be expressed as a [list comprehension](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)?

```py
def powers_of_1000(n: int):
    """
    Return list of (n, exponent) for each power of 1000.
    List is ordered highest exponent first.
    n = 0 - 999.
    exponent = 0,1,2,3...
    """
    p_list = []
    exponent = 0
    while n > 0:
        p_list.insert(0, (n % 1000, exponent))
        n = n // 1000
        exponent += 1

    return p_list
```

The [test function](https://github.com/jldec/shortscale-py/blob/main/tests/test_shortscale.py) took just 3 lines:

```py
def test_shortscale():
    for (num, s) in TESTS:
        assert shortscale.shortscale(num) == s
```

## Benchmarks

I was pleased with the [benchmarks](https://github.com/jldec/shortscale-py/blob/main/tests/bench_shortscale.py) as well. For this string-manipulation test-case, Python is only 2-3x slower than JavaScript on V8.

Compiled languages like Go and Rust will outperform that, but again, not by a huge amount.   

The results below are from my personal M1 arm64 running macOS.

#### Python
```
$ python tests/bench_shortscale.py 
         1 calls,        100 bytes,    11750 ns/call
         2 calls,        200 bytes,     5584 ns/call
         5 calls,        500 bytes,     4367 ns/call
        10 calls,       1000 bytes,     4158 ns/call
        20 calls,       2000 bytes,     4087 ns/call
        50 calls,       5000 bytes,     4043 ns/call
       100 calls,      10000 bytes,     4063 ns/call
       200 calls,      20000 bytes,     4055 ns/call
       500 calls,      50000 bytes,     3914 ns/call
      1000 calls,     100000 bytes,     3839 ns/call
      2000 calls,     200000 bytes,     3426 ns/call
      5000 calls,     500000 bytes,     3044 ns/call
     10000 calls,    1000000 bytes,     2479 ns/call
     20000 calls,    2000000 bytes,     2131 ns/call
     50000 calls,    5000000 bytes,     2067 ns/call
    100000 calls,   10000000 bytes,     2072 ns/call
```

#### Javascript
```
> node test/bench.js

20000 calls, 2000000 bytes, 1083 ns/call
20000 calls, 2000000 bytes, 863 ns/call
20000 calls, 2000000 bytes, 793 ns/call
20000 calls, 2000000 bytes, 809 ns/call
20000 calls, 2000000 bytes, 789 ns/call
20000 calls, 2000000 bytes, 809 ns/call
20000 calls, 2000000 bytes, 774 ns/call
20000 calls, 2000000 bytes, 782 ns/call
20000 calls, 2000000 bytes, 796 ns/call
20000 calls, 2000000 bytes, 792 ns/call
20000 calls, 2000000 bytes, 791 ns/call
20000 calls, 2000000 bytes, 803 ns/call
20000 calls, 2000000 bytes, 796 ns/call
20000 calls, 2000000 bytes, 790 ns/call
20000 calls, 2000000 bytes, 797 ns/call
```

#### Go
```
$ go test -bench . -benchmem
goos: darwin
goarch: arm64
pkg: github.com/jldec/shortscale-go
BenchmarkShortscale-8   	 4227788	       252.0 ns/op	     248 B/op	       5 allocs/op
--- BENCH: BenchmarkShortscale-8
    shortscale_test.go:38: 1 iterations, 100 bytes
    shortscale_test.go:38: 100 iterations, 10000 bytes
    shortscale_test.go:38: 10000 iterations, 1000000 bytes
    shortscale_test.go:38: 1000000 iterations, 100000000 bytes
    shortscale_test.go:38: 4227788 iterations, 422778800 bytes
PASS
ok  	github.com/jldec/shortscale-go	1.629s
```

#### Rust
```
$ cargo bench

running 2 tests
test a_shortscale                        ... bench:         182 ns/iter (+/- 3)
test b_shortscale_string_writer_no_alloc ... bench:          63 ns/iter (+/- 2)

test result: ok. 0 passed; 0 failed; 0 ignored; 2 measured
```

For a small optimization, check out this [PR](https://github.com/jldec/shortscale-py/pull/1/files).


>> Keep on learning  
>> 🚀


---- #excerpt ----

From zero to publishing a Python module on pypi.org.































