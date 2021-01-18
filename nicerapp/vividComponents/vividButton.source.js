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
        this.t = $(this.el).attr('theme');
    }
}
