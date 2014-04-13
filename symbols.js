
;(function () {
    var m = {
        x : function (x) {
            return $('<span style="font-family:serif"/>').text(x)
        },
        i : function (x) {
            return $('<i style="font-family:serif"/>').text(x)
        },
        f : function (a, b) {
            return $('<table/>').append(
                $('<tr style="border-bottom:1px solid black"/>').append($('<td align="middle"/>').append(a.css('font-size', 'small')))
            ).append(
                $('<tr/>').append($('<td align="middle"/>').append(b.css('font-size', 'small')))
            )
        },
        supsub : function (a, b) {
            if (!a) a = $('<span>&nbsp;</span>')
            if (!b) b = $('<span>&nbsp;</span>')
            return $('<table/>').append(
                $('<tr/>').append($('<td/>').append(a.css('font-size', 'small')))
            ).append(
                $('<tr/>').append($('<td/>').append(b.css('font-size', 'small')))
            )
        },
        overline : function (x) {
            var oldD = x.css('display')
            x.css('display', 'none')
            $('body').append(x)
            var w = x.width()
            x.detach()
            x.css('display', oldD)

            var d = $('<div/>')
            d.append($('<div style="border-bottom:1px solid black;width:' + w + 'px;height:3px;margin-right:-' + w + 'px;margin-bottom:-3px"/>'))
            d.append(x)
            return d
        },
        c : function () {
            var t = $('<table/>')
            var r = $('<tr/>')
            t.append(r)
            for (var i = 0; i < arguments.length; i++) {
                var a = arguments[i]
                r.append($('<td/>').append(a))
            }
            return t
        },
        sqrt : function (x) {
            return m.c($('<span style="font-size:90%">&radic;</span>'), $('<div style="border-top:1px solid black"/>').append(x))
        }
    }

    var cache = {}

    drawLatex = function (s) {
        var div = cache[s]
        if (div) return div.clone()

        var originalS = s

        function peek(re) {
            return s.match(re)
        }
        function pull(re) {
            var mm = peek(re)
            if (mm) {
                s = s.slice(mm[0].length)
                return mm[0]
            }
        }
        function S() {
            var x = c()
            if (s == '') return x
            else throw 'parse error for "' + originalS + '", stuff left: "' + s + '"'
        }
        function c() {
            var a = []
            while (true) {
                var dd = d()
                pull(/^\s*(\{\})?/)
                if (dd) a.push(dd)
                else break
            }
            if (a.length > 0)
                return m.c.apply(null, a)
        }
        function d() {
            if (pull(/^\\?sqrt[\{\(]/)) {
                var x = c()
                if (pull(/^[\}\)]/)) return m.sqrt(x)
                else throw 'missing }'
            }

            if (pull(/^\\?frac[\{\(]/)) {
                var x = c()
                if (!pull(/^(\}\{|,)/)) throw 'missing }{'
                var y = c()
                if (pull(/^[\}\)]/)) return m.f(x, y)
                else throw 'missing }'
            }

            if (pull(/^\\overline\{/)) {
                var x = c()
                if (pull(/^\}/)) return m.overline(x)
                else throw 'missing }'
            }

            var x = pull(/^\\[a-zA-Z]+/)
            if (x) return m.i(latexToUnicode(x))

            x = pull(/^[a-zA-Z'\u00ff-\uffff]+/)
            if (x) return m.i(x)

            x = pull(/^[0-9\+\-]+/)
            if (x) return m.x(x.replace(/-/g, '−'))

            x = supsub()
            if (x) return x

            if (pull(/^[\{\(]/)) {
                var x = c()
                if (pull(/^[\}\)]/)) return x
                else throw 'missing }'
            }
        }
        function supsub() {
            var a = {}
            var x = pull(/^[\_\^]/)
            if (x) a[x] = d()
            x = pull(/^[\_\^]/)
            if (x) a[x] = d()
            if (a['^'] || a['_'])
                return m.supsub(a['^'], a['_'])
        }

        cache[originalS] = S()
        return cache[originalS].clone()
    }
    
    var latexToUnicodeString = "\\Box□\\Bumpeq≎\\Cap⋒\\Cup⋓\\DeltaΔ\\Diamond◇\\Downarrow⇓\\FinvℲ\\GammaΓ\\Imℑ\\Join⋈\\LambdaΛ\\Leftarrow⇐\\Leftrightarrow⇔\\Lleftarrow⇚\\Longleftarrow⇐\\Longleftrightarrow⇔\\Longrightarrow⇒\\Lsh↰\\OmegaΩ\\PhiΦ\\PiΠ\\PsiΨ\\Reℜ\\Rightarrow⇒\\Rrightarrow⇛\\Rsh↱\\Sigma∑\\Subset⋐\\Supset⋑\\ThetaΘ\\Uparrow⇑\\Updownarrow⇕\\UpsilonΥ\\Vdash⊩\\Vvdash⊪\\XiΞ\\alephא\\alphaα\\angle∠\\angle∠\\approx≈\\approxeq≊\\ast∗\\asymp≍\\backepsilon∍\\backprime‵\\backsim∽\\barwedge⊼\\because∵\\betaβ\\bethב\\between≬\\bigcap⋂\\bigcirc○\\bigcup⋃\\bigodot⊙\\bigoplus⊕\\bigotimes⊗\\bigsqcup⊔\\bigstar★\\bigtriangledown▽\\bigtriangleup△\\biguplus⊎\\bigvee⋁\\bigwedge⋀\\blacklozenge◆\\blacksquare■\\blacktriangle▲\\blacktriangledown▼\\blacktriangleleft◀\\blacktriangleright▷\\bot⊥\\bowtie⋈\\boxdot⊡\\boxminus⊟\\boxplus⊞\\boxtimes⊠\\bullet∙\\bumpeq≏\\cap∩\\cdot⋅\\cdots⋯\\centerdot⋅\\chiχ\\circ∘\\circeq≗\\circlearrowleft↺\\circlearrowright↻\\circledSⓈ\\circledast⊛\\circledcirc⊚\\circleddash⊝\\clubsuit♣\\colon:\\complement∁\\cong≅\\coprod∐\\cup∪\\curlyeqprec⋞\\curlyeqsucc⋟\\curlyvee⋎\\curlywedge⋏\\curvearrowleft↶\\curvearrowright↷\\dagger†\\dalethד\\dashleftarrow⇠\\dashrightarrow⇢\\dashv⊣\\ddagger‡\\ddots⋱\\deltaδ\\diamond⋄\\diamondsuit♢\\digammaϜ\\div÷\\divideontimes⋇\\doteq≐\\doteqdot≑\\dotplus∔\\dots…\\downarrow↓\\downdownarrows⇊\\downharpoonleft⇃\\downharpoonright⇂\\ellℓ\\emptyset∅\\epsilon∊\\eqcirc≖\\equiv≡\\etaη\\ethð\\exists∃\\fallingdotseq≒\\flat♭\\forall∀\\frown⌢\\gammaγ\\ge≥\\geq≥\\geqq≧\\gg≫\\ggg⋙\\gimelג\\gtrdot⋗\\gtreqless⋛\\gtrless≷\\gtrsim≳\\hbarℏ\\hbarℏ\\heartsuit♡\\hookleftarrow↩\\hookrightarrow↪\\hslashℏ\\implies⇒\\in∈\\infty∞\\int∫\\intercal⊺\\iotaι\\kappaκ\\lambdaλ\\langle〈\\lceil⌈\\le≤\\leadsto↝\\leftarrow←\\leftarrowtail↢\\leftharpoondown↽\\leftharpoonup↼\\leftleftarrows⇇\\leftrightarrow↔\\leftrightarrows⇆\\leftrightharpoons⇋\\leftrightsquigarrow↭\\leftthreetimes⋋\\leq≤\\leqq≦\\leqslant≤\\lessdot⋖\\lesseqgtr⋚\\lessgtr≶\\lesssim≲\\lfloor⌊\\lhd⊲\\ll≪\\lll⋘\\longleftarrow←\\longleftrightarrow↔\\longmapsto⇖\\longrightarrow→\\looparrowleft↫\\looparrowright↬\\lozenge◊\\ltimes⋉\\mapsto↦\\measuredangle∡\\mho℧\\mho℧\\mid∣\\models⊨\\mp∓\\muμ\\multimap⊸\\nabla∇\\natural♮\\nearrow↗\\neg¬\\neq≠\\nexists∄\\ni∋\\notin∉\\nuν\\nwarrow↖\\odot⊙\\oint∮\\omegaω\\ominus⊖\\oplus⊕\\oslash⊘\\otimes⊗\\parallel∥\\partial∂\\perp⊥\\phiϕ\\piπ\\pitchfork⋔\\pm±\\prec≺\\preccurlyeq≼\\preceq≼\\precsim≾\\prime′\\prod∏\\propto∝\\psiψ\\rangle〉\\rceil⌉\\rfloor⌋\\rhd⊳\\rhoρ\\rightarrow→\\rightarrowtail↣\\rightharpoondown⇁\\rightharpoonup⇀\\rightleftarrows⇄\\rightleftharpoons⇌\\rightrightarrows⇉\\rightsquigarrow⇝\\rightthreetimes⋌\\risingdotseq≓\\rtimes⋈\\searrow↘\\setminus∖\\sharp♯\\shortparallel∥\\sigmaσ\\sim∼\\simeq≃\\smallfrown⌢\\smallsetminus∖\\smallsmile⌣\\smile⌣\\spadesuit♠\\sphericalangle∢\\sqcap⊓\\sqcup⊔\\sqsubset⊏\\sqsubset⊏\\sqsubseteq⊑\\sqsupset⊐\\sqsupset⊐\\sqsupseteq⊒\\square□\\star⋆\\subset⊂\\subseteq⊆\\succ≻\\succcurlyeq≽\\succeq≽\\succsim≿\\sum∑\\supset⊃\\supseteq⊇\\surd√\\swarrow↙\\tauτ\\therefore∴\\thetaθ\\thickapprox≈\\thicksim∼\\times×\\top⊤\\triangle△\\triangledown▽\\triangleleft◁\\trianglelefteq⊴\\triangleq≜\\triangleright▷\\trianglerighteq⊵\\twoheadleftarrow↞\\twoheadrightarrow↠\\unlhd⊴\\unrhd⊵\\uparrow↑\\updownarrow↕\\upharpoonleft↿\\upharpoonright↾\\uplus⊎\\upsilonυ\\upuparrows⇈\\vDash⊨\\varepsilonε\\varkappaϰ\\varnothing∅\\varphiφ\\varpiϖ\\varpropto∝\\varrhoϱ\\varsigmaς\\varthetaϑ\\vartriangle△\\vartriangleleft⊲\\vartriangleright⊳\\vdash⊢\\vdots⋮\\vee∨\\veebar⊻\\wedge∧\\wp℘\\wr≀\\xiξ\\zetaζ"

    function latexToUnicode(la) {
        var m = latexToUnicodeString.match(new RegExp(_.escapeRegExp(la) + '\\w*(.)'))
        if (m) return m[1]
    }
})();

particleSymbols = {
    "1": "\\om_L^\\wedge",
    "2": "\\om_R^\\wedge",
    "3": "W^+",
    "4": "W'^+",
    "5": "e_T^\\wedge \\ph_+",
    "6": "e_T^\\wedge \\ph_0",
    "7": "e_T^\\vee \\ph_+",
    "8": "e_T^\\vee \\ph_0",
    "9": "e_S^\\wedge \\ph_+",
    "10": "e_S^\\wedge \\ph_0",
    "11": "e_S^\\vee \\ph_+",
    "12": "e_S^\\vee \\ph_0",
    "13": "g^{r \\overline{g}}",
    "14": "g^{r \\overline{b}}",
    "15": "g^{b \\overline{g}}",
    "16": "\\nu_{eL}^\\wedge",
    "17": "\\nu_{eL}^\\vee",
    "18": "e_L^\\wedge",
    "19": "e_L^\\vee",
    "20": "\\nu_{eR}^\\wedge",
    "21": "\\nu_{eR}^\\vee",
    "22": "e_R^\\wedge",
    "23": "e_R^\\vee",
    "24": "u_L^\\wedge",
    "25": "u_L^\\vee",
    "26": "d_L^\\wedge",
    "27": "d_L^\\vee",
    "28": "u_R^\\wedge",
    "29": "u_R^\\vee",
    "30": "d_R^\\wedge",
    "31": "d_R^\\vee",
    "48": "\\nu_{\\mu L}^\\wedge",
    "49": "\\nu_{\\mu L}^\\vee",
    "50": "\\mu_L^\\wedge",
    "51": "\\mu_L^\\vee",
    "52": "\\nu_{\\mu R}^\\wedge",
    "53": "\\nu_{\\mu R}^\\vee",
    "54": "\\mu_R^\\wedge",
    "55": "\\mu_R^\\vee",
    "56": "c_L^\\wedge",
    "57": "c_L^\\vee",
    "58": "s_L^\\wedge",
    "59": "s_L^\\vee",
    "60": "c_R^\\wedge",
    "61": "c_R^\\vee",
    "62": "s_R^\\wedge",
    "63": "s_R^\\vee",
    "80": "\\nu_{\\ta L}^\\wedge",
    "81": "\\nu_{\\ta L}^\\vee",
    "82": "\\ta_L^\\wedge",
    "83": "\\ta_L^\\vee",
    "84": "\\nu_{\\ta R}^\\wedge",
    "85": "\\nu_{\\ta R}^\\vee",
    "86": "\\ta_R^\\wedge",
    "87": "\\ta_R^\\vee",
    "88": "t_L^\\wedge",
    "89": "t_L^\\vee",
    "90": "b_L^\\wedge",
    "91": "b_L^\\vee",
    "92": "t_R^\\wedge",
    "93": "t_R^\\vee",
    "94": "b_R^\\wedge",
    "95": "b_R^\\vee",
    "112": "x_1 \\Ph",
    "115": "x_2 \\Ph",
    "118": "x_3 \\Ph",
    "121": "\\om_L^\\vee",
    "122": "\\om_R^\\vee",
    "123": "W^-",
    "124": "W'^-",
    "125": "e_T^\\vee \\ph_-",
    "126": "e_T^\\vee \\ph_1",
    "127": "e_T^\\wedge \\ph_-",
    "128": "e_T^\\wedge \\ph_1",
    "129": "e_S^\\vee \\ph_-",
    "130": "e_S^\\vee \\ph_1",
    "131": "e_S^\\wedge \\ph_-",
    "132": "e_S^\\wedge \\ph_1",
    "133": "g^{g \\overline{r}}",
    "134": "g^{b \\overline{r}}",
    "135": "g^{g \\overline{b}}",
    "136": "\\overline{\\nu}{}_{eL}^\\wedge",
    "137": "\\overline{\\nu}{}_{eL}^\\vee",
    "138": "\\overline{e}{}_L^\\wedge",
    "139": "\\overline{e}{}_L^\\vee",
    "140": "\\overline{\\nu}{}_{eR}^\\wedge",
    "141": "\\overline{\\nu}{}_{eR}^\\vee",
    "142": "\\overline{e}{}_R^\\wedge",
    "143": "\\overline{e}{}_R^\\vee",
    "144": "\\overline{u}{}_L^\\wedge",
    "145": "\\overline{u}{}_L^\\vee",
    "146": "\\overline{d}{}_L^\\wedge",
    "147": "\\overline{d}{}_L^\\vee",
    "148": "\\overline{u}{}_R^\\wedge",
    "149": "\\overline{u}{}_R^\\vee",
    "150": "\\overline{d}{}_R^\\wedge",
    "151": "\\overline{d}{}_R^\\vee",
    "168": "\\overline{\\nu}{}_{\\mu L}^\\wedge",
    "169": "\\overline{\\nu}{}_{\\mu L}^\\vee",
    "170": "\\overline{\\mu}{}_L^\\wedge",
    "171": "\\overline{\\mu}{}_L^\\vee",
    "172": "\\overline{\\nu}{}_{\\mu R}^\\wedge",
    "173": "\\overline{\\nu}{}_{\\mu R}^\\vee",
    "174": "\\overline{\\mu}{}_R^\\wedge",
    "175": "\\overline{\\mu}{}_R^\\vee",
    "176": "\\overline{c}{}_L^\\wedge",
    "177": "\\overline{c}{}_L^\\vee",
    "178": "\\overline{s}{}_L^\\wedge",
    "179": "\\overline{s}{}_L^\\vee",
    "180": "\\overline{c}{}_R^\\wedge",
    "181": "\\overline{c}{}_R^\\vee",
    "182": "\\overline{s}{}_R^\\wedge",
    "183": "\\overline{s}{}_R^\\vee",
    "200": "\\overline{\\nu}{}_{\\ta L}^\\wedge",
    "201": "\\overline{\\nu}{}_{\\ta L}^\\vee",
    "202": "\\overline{\\ta}{}_L^\\wedge",
    "203": "\\overline{\\ta}{}_L^\\vee",
    "204": "\\overline{\\nu}{}_{\\ta R}^\\wedge",
    "205": "\\overline{\\nu}{}_{\\ta R}^\\vee",
    "206": "\\overline{\\ta}{}_R^\\wedge",
    "207": "\\overline{\\ta}{}_R^\\vee",
    "208": "\\overline{t}{}_L^\\wedge",
    "209": "\\overline{t}{}_L^\\vee",
    "210": "\\overline{b}{}_L^\\wedge",
    "211": "\\overline{b}{}_L^\\vee",
    "212": "\\overline{t}{}_R^\\wedge",
    "213": "\\overline{t}{}_R^\\vee",
    "214": "\\overline{b}{}_R^\\wedge",
    "215": "\\overline{b}{}_R^\\vee",
    "232": "x_1 \\overline{\\Ph}",
    "235": "x_2 \\overline{\\Ph}",
    "238": "x_3 \\overline{\\Ph}",
    "241": "\\ga",
    "242": "X",
    "243": "e \\phi_X"
}
