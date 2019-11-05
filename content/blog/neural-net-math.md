---
date: "2019-08-12"
title: Neural Net Math
draft: true
---

* Based on [this](https://divadnojnarg.github.io/blog/mathjax/)
* [examples](https://github.com/DivadNojnarg/divadnojnarg.github.io/blob/master/blog/mathjax/index.html)

#### Notation:
<!-- TODO: think about writing this in latex and compiling to html? -->
<!-- https://tex.stackexchange.com/questions/39309/convert-latex-to-html -->

<p>
<!--
$$
\begin{equation}
x(t) = e^{\int_{t_0}^tp(s)ds}\Bigg(\int_{t_0}^t\Big(q(s)e^{-\int_{t_0}^sp(\tau)d\tau}\Big)ds + x_0\Bigg).
\end{equation}
$$
-->

* TODO: graph of a simple neural net here (the one I drew out) *
<br><br>

let $b_{j}^l = $ bias of $j$th neuron in the $l$th layer
<br><br>

let $w_{jk}^l = $ weight of connection between node $j$ of $l$th layer, and node $k$ of $(l-1)$th layer. <br>
<br><br>

let $a_{j}^l = $ the activation of the $j$th neuron in the $l$th layer <br>
$$
\begin{equation}
a_{j}^l = \sigma( \sum_{k} (w_{jk}^l a_k^l + b_j^l))
\end{equation}
$$

where $\sigma(x) = \frac{1}{1+e^{-z}} $ is the sigmoid function <br>
TODO: graph of sigmoid function and its derivative


let $w_{l} = \begin{bmatrix}
                w_{00}^l & w_{01}^l & w_{02}^l & \cdots & w_{0k}^l\\
                w_{10}^l & w_{11}^l & w_{12}^l & \cdots & w_{1k}^l\\
                w_{20}^l & w_{21}^l & w_{22}^l & \cdots & w_{2k}^l\\
                \vdots & \vdots & \vdots & \ddots & \vdots\\
                w_{j0}^l & w_{j1}^l & w_{j2}^l & \cdots & w_{jk}^l
             \end{bmatrix}$
(the weight matrix for layer $l$) <br>
(where there are $j$ nodes in layer $l$ and $k$ nodes in layer $l-1$).
<br><br>


let $b_l = \begin{bmatrix}
                b_0^l\\
                b_1^l\\
                b_2^l\\
                \vdots\\
                b_j^l\\
             \end{bmatrix}$
(bias vector for layer $l$, with $j$ nodes) <br>
let $a_l = \begin{bmatrix}
                a_0^l\\
                a_1^l\\
                a_2^l\\
                \vdots\\
                a_j^l\\
             \end{bmatrix}$
(activation vector for layer $l$) <br>

Now we can rewrite the activation equations like so: <br>
$a_l = \sigma(w^l a^{l-1} + b^l) = \sigma(z^l)$ <br><br>
where we let $z^l = w^l a^{l-1} + b^l$ (the weighted input to the nuerons in layer $l$). <br>
let $z_j^l = \sum_{k} (w_{jk}^l a_k^{l-1} + b_j^l)$ (the weighted input to the activation function for neuron $j$ in layer $l$).

</p>


#### Evaluating a Neural Net:
