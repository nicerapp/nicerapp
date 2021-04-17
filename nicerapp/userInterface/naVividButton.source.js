class naVividButton {
    constructor(el,html,parent) {
        this.p = parent;
        if (typeof html=='string' && html!=='') {
            var h = $(html);
            $(parent).append(h);
            this.el = h[0];
        } else {
            this.el = el;
        };
        this.theme = $(this.el).attr('theme');
        this.type = $(this.el).is('.vividButton_icon') ? 'icon' : 'text'; 
        switch (this.type) {
            case 'icon' : this.ui = new naVividButton_icon(this.el); break;
            case 'text' : break;
        }
    }
    
    
}

class naVividButton_icon {
    constructor (el) {
        var t = this;
        t.el = el;
        t.gradientRadius = 10;
        $('.cvbBorderCSS, .cvbImgBorder, .cvbImgTile, .cvbImgButton', el).hover(function () { t.hoverStarts(t) }, function () { t.hoverEnds(t) });
    }
    
    hoverStarts (t) {
        t.animDirection = 'increase';
        t.increaseGradient(t);
    }
    
    hoverEnds(t) {
        t.animDirection = 'decrease';
        t.decreaseGradient(t);
    }
    
    increaseGradient(t) {
        t.gradientRadius += 1;
        if (t.gradientRadius <= 50 && t.animDirection=='increase') setTimeout (function () {
            t.setGradient(t);
            t.increaseGradient(t);
        }, 50);
    }
    
    decreaseGradient(t) {
        t.gradientRadius -= 1;
        if (t.gradientRadius >= 10 && t.animDirection=='decrease') setTimeout (function () {
            t.setGradient(t);
            t.decreaseGradient(t);
        }, 50);
    }
    
    setGradient(t) {
        $('.cvbBorderCSS', t.el)[0].style.backgroundImage = 'radial-gradient(circle '+t.gradientRadius+'px at center, rgba(0,255,0,1), rgba(0,0,0,0))';
    }
}
