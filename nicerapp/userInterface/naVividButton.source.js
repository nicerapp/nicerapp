class naVividButton {
    constructor(el,html,parent) {
        var t = this;
        t.p = parent;
        if (typeof html=='string' && html!=='') {
            var h = $(html);
            $(parent).append(h);
            t.el = h[0];
        } else {
            t.el = el;
        };
        t.theme = $(this.el).attr('theme');
        t.type = $(this.el).is('.vividButton_icon') ? 'icon' : 'text'; 
        switch (this.type) {
            case 'icon' : this.ui = new naVividButton_icon(this.el); break;
            case 'text' : break;
        }
    }
    
    disable () {
        $(this.el).addClass('disabled');
        $('.cvbBorderCSS, .cvbImgBorder, .cvbImgTile, .cvbImgButton', this.el).css({filter:'grayscale(100%)'});
    }
    
    enable () {
        $(this.el).removeClass('disabled');
        $('.cvbBorderCSS, .cvbImgBorder, .cvbImgTile, .cvbImgButton', this.el).css({filter:'grayscale(0%)'});
    }    
    
    select () {
        $(this.el).addClass('selected');
        $('.cvbBorderCSS', this.el).css({backgroundImage : 'radial-gradient(circle 70px at center, rgba(255, 166, 0, 1), rgba(255,166,0,1)', boxShadow : '0px 0px 2px 2px rgba(255,166,0,0.7)'});
    }    

    deselect () {
        $(this.el).removeClass('selected');
        $('.cvbBorderCSS', this.el).css({backgroundImage : 'radial-gradient(circle 10px at center, rgba(0, 255, 0, 1), rgba(0,0,0,0)', boxShadow : ''});
    }    
}

class naVividButton_icon {
    constructor (el) {
        var t = this;
        t.el = el;
        t.gradientRadius = 10;
        setTimeout(function() {
            $('.cvbBorderCSS, .cvbImgBorder, .cvbImgTile, .cvbImgButton', el).hover(function () { t.hoverStarts(t) }, function () { t.hoverEnds(t) });
        }, 10 * 1000);
    }
    
    hoverStarts (t) {
        t.animDirection = 'increase';
        if (!$(t.el).is('.disabled') && !$(t.el).is('.selected')) t.increaseGradient(t);
    }
    
    hoverEnds(t) {
        t.animDirection = 'decrease';
        if (!$(t.el).is('.disabled') && !$(t.el).is('.selected')) t.decreaseGradient(t);
    }
    
    increaseGradient(t) {
        t.gradientRadius += 2;
        if (t.gradientRadius <= 70 && t.animDirection=='increase') setTimeout (function () {
            t.setGradient(t);
            t.increaseGradient(t);
        }, 50);
    }
    
    decreaseGradient(t) {
        t.gradientRadius -= 2;
        if (t.gradientRadius >= 10 && t.animDirection=='decrease') setTimeout (function () {
            t.setGradient(t);
            t.decreaseGradient(t);
        }, 50);
    }
    
    setGradient(t) {
        $('.cvbBorderCSS', t.el)[0].style.backgroundImage = 'radial-gradient(circle '+t.gradientRadius+'px at center, rgba(0,255,0,1), rgba(0,0,0,0))';
    }
}
