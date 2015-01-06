# zanalyze
Print basic stats and histogram plot for a Redis ZSET:
 - # of members
 - min
 - max
 - mean
 - standard deviation
 - median
 - 90th, 95th, 99th percentiles
 - geometric mean & std. dev.
 - margin of error
 - histogram plot (via gnuplot)


## Install
    
    brew install gnuplot --with-x
    npm install -g zanalyze

## Usage
    
```
  Usage: zanalyze [options] <key>

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -p, --port [port]        Redis port
    -h, --host [host]        Redis host
    -b, --buckets [buckets]  Number of histogram buckets
```

## Example
```
$ node test/normal-curve.js test_zset
$ bin/zanalyze test_zset
Members:               3940
Min:                   -270.6858684774488 (9734)
Max:                   273.20951470173895 (7880)
Mean:                  2.5423567979667467
StdDev:                100.71556709669699
Median:                5.273612542077899
90th Percentile:       135.47056117095053
95th Percentile:       164.3777091987431
99th Percentile:       216.59192368388176
Mean (geometric):      NaN
StdDev (geometric):    NaN
Margin of Error:       3.1448835068475542


                              ZSET Plot: test_zset
            +     +    +     +     +     +    +     +     +     +    +
  800 ++----+-----+----+-----+-----+-----**---+-----+-----+-----+----+----++
      |                            ***   **                                |
  700 ++                           * *   **   ***                         ++
      |                            * *   **   * *                          |
  600 ++                           * *   **   * *                         ++
      |                      ***   * *   **   * *                          |
  500 ++                     * *   * *   **   * *                         ++
      |                      * *   * *   **   * *                          |
  400 ++               ***   * *   * *   **   * *   ***                   ++
      |                * *   * *   * *   **   * *   * *                    |
  300 ++               * *   * *   * *   **   * *   * *                   ++
      |                * *   * *   * *   **   * *   * *                    |
  200 ++               * *   * *   * *   **   * *   * *                   ++
      |           **   * *   * *   * *   **   * *   * *   ***              |
  100 ++          **   * *   * *   * *   **   * *   * *   * *             ++
      |     ***   **   * *   * *   * *   **   * *   * *   * *   **         |
    0 ++----***---**---***---***---***---**---***---***---***---**---***--++
            +     +    +     +     +     +    +     +     +     +    +
          -244  -190 -135   -81   -27   27   81    135   190   244  299
                                   Bucket Mean
```

## License

The MIT License (MIT)

Copyright (c) 2014 Alex Ehrnschwender

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

