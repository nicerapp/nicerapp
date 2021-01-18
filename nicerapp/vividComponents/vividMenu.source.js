class naVividMenu {
    constructor(el) {
        var t = this;
        t.el = el;
        t.t = $(el).attr('theme');
        t.items = [];
        t.initItems();
        t.onresize();
    }
    
    initItems() {
        var t = this;
        $(t.el).find('li').each(function(idx,li) {
            var html = '<div id="'+t.el.id+'_'+idx+'" class="vividButton" theme="'+t.t+'">'+$(li).children('a')[0].outerHTML+'</div>';
            t.items[idx] = {
                li : li,
                b : new naVividButton(null,html,t.el),
                level : jQuery(li).parents('ul').length,
                path : ''
            };
            var it = t.items[idx];
            li.it = it;
            $('#'+it.b.el.id/*+'::before'*/).bind('mouseover', function() {
                t.onmouseover(it);
            });
            $('#'+it.b.el.id/*+'::before'*/).bind('mouseout', function() {
                t.onmouseout(it);
            });
            $(li).parents('ul').each(function(idx2,ul){
                var it = t.items[idx];
                for (var i=0; i<t.items.length; i++) {
                    var it2 = t.items[i];
                    if ($(ul).parents('li')[0]===it2.li) {
                        if (it.path!=='') it.path += ',';
                        it.path += '#'+it2.b.el.id;
                        if (!it.p) it.p = it2.li;
                        if (!it.parent) it.parent = i;
                    }
                }
            });
        });
        //debugger;
    }
    
    onresize() {
        var
        t = this,
        levels = {},
        bw = $(window).width(),
        pl = null;
        
        for (var i=0; i<t.items.length; i++) {
            var it = t.items[i];
            it.label = $(it.b.el).children('a').html();
            it.pul = $(it.li).parents('ul')[0];
            
            $(it.pul).children('li').each(function(idx,li) {
                if (it.li === li) {
                    it.levelIdx = idx;
                }
            });
            
            var 
            parent = t.items[it.parent],
            l = levels['path '+it.path],
            placing = 'right',
            right = (bw - jQuery(it.b.el).offset().left /* - ($(it.b.el).width() * 0.7)*/ - (parent ? parent.offsetX : $(it.b.el).width())),
            left = jQuery(it.b.el).offset().left + (parent ? parent.offsetX : $(it.b.el).width());
            
            if (left > right) placing = 'left';
            if (placing=='left') var width = left; else var width = right;

            var
            columnCount = Math.floor((width-($(it.b.el).width()/3)) / $(it.b.el).width()),
            itemsOnLevelCount = 0;
            
            for (var j=0; j<t.items.length; j++) {
                var it2 = t.items[j];
                if (it2.parent === it.parent && it2.level === it.level) itemsOnLevelCount++;
            };
            
            var
            rowCount = Math.ceil(itemsOnLevelCount / columnCount);
            
            if (it.level===0) {
                columnCount = 1;
                rowCount = 9999;
            } else if (columnCount > rowCount) {
                columnCount = Math.floor(Math.sqrt(itemsOnLevelCount));
                rowCount = Math.ceil(itemsOnLevelCount / columnCount);
            };
            //rowCount++;
            //rowCount++;
            
            var
            column = 0,
            columnIdx = 1;
            
            for (var j=0; j<t.items.length; j++) {
                var it2 = t.items[j];
                if (it2.parent === it.parent && it2.level === it.level) {
                    if ((it.levelIdx+1) <= (column * rowCount) + columnIdx ) {
                        //columnIdx--;
                    } else if (columnIdx >= rowCount) {
                        column++;
                        columnIdx = 1;
                    } else columnIdx++;
                }
            };
            
            var           
			l = levels['path '+it.path];
  			it.childrenPlacement = placing;
            it.columnIdx = columnIdx;
            it.column = column;
            it.offsetX = (
                it.level === 1
                ? ($(it.b.el).width() + 20) * it.levelIdx
                : l
                    ? it.level === 2
                        ? placing==='right'
                            ? l.offsetX + parent.offsetX + ( ($(it.b.el).width()+20) * it.column) 
                            : l.offsetX + parent.offsetX - ( ($(it.b.el).width()+20) * it.column) 
                        : placing==='right'
                            ? l.offsetX + parent.offsetX + ( ($(it.b.el).width()+20) * it.column) + ($(it.b.el).width()/2)
                            : l.offsetX + parent.offsetX - ( ($(it.b.el).width()+20) * it.column) - ($(it.b.el).width()/2)
                    : it.level === 2
                        ? placing==='right'
                            ? parent.offsetX + ( ($(it.b.el).width()+20) * it.column) 
                            : parent.offsetX - ( ($(it.b.el).width()+20) * it.column) 
                        : placing==='right'
                            ? parent.offsetX + ( ($(it.b.el).width()+20) * it.column) + ($(it.b.el).width()/2)
                            : parent.offsetX - ( ($(it.b.el).width()+20) * it.column) - ($(it.b.el).width()/2)
            );
            it.offsetY = (
                it.level === 1
                ? 0
                : it.level === 2
                    ? parent.offsetY + ( ($(it.b.el).height()+20) * it.columnIdx )
                    : parent.offsetY + ( ($(it.b.el).height()+20) * (it.columnIdx-1) )+ ($(it.b.el).height())
            );
            
            if (!l) {
                if (!parent) {
                    pl = {
                        offsetX : 0,
                        offsetY : 0,
                        zIndexOffset : 0
                    }
                } else {
                    pl = levels['path '+parent.path];
                }
                
                var zof = pl.zIndexOffset + 1;
                levels['path '+it.path] = jQuery.extend({}, pl);
                levels['path '+it.path].offsetX = pl.offsetX;
				levels['path '+it.path].offsetY = pl.offsetY;
                levels['path '+it.path].zIndexOffset = zof;
                l = levels['path '+it.path];
            };
            it.zIndex = (100 * 1000) + l.zIndexOffset;

            $(it.b.el).css({
                display : 'none',
                left : it.offsetX,
                top : it.offsetY,
                zIndex : it.zIndex
            });
            if (it.level===1) $(it.b.el).fadeIn('fast');
            $(it.b.el).fitText();
        }
        //debugger;
    }
    
    onmouseover(it) {
        var
        t = this,
        opLevMax = 1,
        opLevMin = 0.2;
        
        if (it.p) it.p.it.travelledIntoChild = true;
        if (t.timeoutMouseout) clearTimeout (t.timeoutMouseout);
        if (t.timeoutMouseover) clearTimeout (t.timeoutMouseover);
        t.timeoutMouseover = setTimeout (function() {
            $(it.p).find('li').each(function(idx,pcli){
                //if (pcli!==it.li) {
                    if (pcli.openChildren) pcli.openChildren.each(function(idx2,li) {
                        $(li.it.b.el).fadeOut('fast');
                        if (li.openChildren) li.openChildren.each(function(idx3,li2){
                            $(li2.it.b.el).fadeOut('fast');
                        });
                    });
                //}
            });
            
            it.li.openChildren = $(it.li).children('ul').children('li');
            var hasChildren = false;
            it.li.openChildren.each(function(idx,li) {
                var
                opLev = opLevMin + (
                    ( (opLevMax-opLevMin) / ((li.it.level-it.level)) )
                );
                if (li.it.level!==it.level) {
                    if ($(li.it.b.el).css('display')==='none') $(li.it.b.el).css({display:'block',opacity:0});
                    $(li.it.b.el).stop(true,true).delay(20).animate({opacity:opLev},'fast');
                    hasChildren = true;
                }
            });
            
            $(it.li).parents('ul').each(function(idx,pul) {
                //debugger;
                if (idx<$(it.li).parents('ul').length-1) $(pul).children('li').each(function(idx2,cli){
                    var
                    opLevFactor =
                        (opLevMax-opLevMin) / (cli.it.level + idx)*10//(cli.it.level /*>*/<= $(it.li).parents('ul').length ? cli.it.level * 2 : (((opLevMax-opLevMin)*10*(idx+2))-2)*5),
                    opLev = 
                        opLevMax - (
                            (opLevMax-opLevMin) / ((opLevFactor + cli.it.level) / 4)
                        );
                        
                        
                    //if (cli.it.label=='Dark mode'||cli.it.label=='Anime') debugger;
                    if (opLev >= 0 && opLev <= 1) {
                        if ($(cli.it.b.el).css('display')==='none') $(cli.it.b.el).css({display:'block',opacity:0});
                        $(cli.it.b.el).stop(true,true).delay(20).animate({opacity:opLev},'fast');
                    }
                });
                
                if (idx===0 && !hasChildren) $(pul).children('li').each(function(idx,cli){
                    if ($(cli.it.b.el).css('display')==='none') $(cli.it.b.el).css({display:'block',opacity:0});
                    $(cli.it.b.el).stop(true,true).delay(20).animate({opacity:1},'fast');
                });
            });

            $(it.path).stop(true,true).animate ({opacity:1},'fast');
            $('#'+it.b.el.id).stop(true,true).delay(20).animate ({opacity:1},'fast');
            var opLev = null, opLev2 = null;
            if (it.travelledIntoChild && it.parent) {
                $(it.p).children('ul').children('li').each(function(idx3,li3) {
                    opLev = opLevMin + (
                        ( (opLevMax-opLevMin) / ((li3.it.level-it.p.it.level+1)) )
                    );
                    if (li3.it.level===it.level) {
                        if ($(li3.it.b.el).css('display')==='none') $(li3.it.b.el).css({display:'block',opacity:0});
                        $(li3.it.b.el).stop(true,true).delay(20).animate({opacity:opLev},'fast');
                        hasChildren = true;
                    }
                });
                t.items[it.parent].li.openChildren.each(function(idx,el){
                    if ($(el.it.b.el).css('display')==='none') $(el.it.b.el).css({display:'block',opacity:0});
                    opLev2 = (
                        el === it.li
                        ? 1
                        : opLev
                    );
                    $(el.it.b.el).stop(true,true).delay(20).animate ({opacity:opLev2},'fast');
                });
                $(it.li).children('ul').children('li').each(function(idx2,el2){
                    if ($(el2.it.b.el).css('display')==='none') $(el2.it.b.el).css({display:'block',opacity:0});
                    $(el2.it.b.el).stop(true,true).delay(20).animate ({opacity:1},'fast');
                });
                delete it.travelledIntoChild;
            }
        }, 250);
    }
    
    onmouseout(it) {
        var
        t = this;
        if (t.timeoutMouseout) clearTimeout (t.timeoutMouseout);
        t.timeoutMouseout = setTimeout (function() {
            for (var i=0; i<t.items.length; i++) {
                var it2 = t.items[i];
                if (it2.li.openChildren) it2.li.openChildren.each(function(idx,li) {
                    $(li.it.b.el).fadeOut('slow');
                });
                if (it2.level===1) {
                    $(it2.b.el).animate({opacity:1},'fast');
                }
            }
        }, 1000);
    }

}
