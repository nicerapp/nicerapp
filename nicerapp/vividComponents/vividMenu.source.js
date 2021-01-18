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
            $(it.b.el).bind('mouseover', function() {
                t.onmouseover(it);
            });
            $(it.b.el).bind('mouseout', function() {
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
            it.p = $(it.li).parents('ul')[0];
            
            
            /*
            $(it.li).parents('ul:last-child').find('li').each(function(idx,ali) {
                console.log (it.b.el.id + ' - ' + it.label +  ' - ' + idx);
                if (it.li===ali) {
                    //it.parent = idx;
                    if (
                        it.label=='CGI'
                        || it.label=='HD Video'
                        || it.label=='Dark mode'
                        || it.label=='Landscape'
                        || it.label=='Portrait'
                        || it.label=='Tiled'
                    ) debugger;
                }
            });
            */
            

            $(it.p).children('li').each(function(idx,li) {
                if (it.li === li) {
                    it.levelIdx = idx;
                }
                /*
                for (var j=0; j<t.items.length; j++) {
                    var it2 = t.items[j];
                    if (it2.li===li && it.li===li) {
                        it.parent = j;
                        break;
                    }
                };*/
            });
            
            
            var 
            parent = t.items[it.parent],
            l = levels['path '+it.path],
            placing = 'right',
            right = (bw - jQuery(it.b.el).offset().left /*- ($(it.b.el).width() * 0.7)*/ - (parent ? parent.offsetX : 0)),
            left = jQuery(it.b.el).offset().left + (parent ? parent.offsetX : 0);
            
            if (left > right) placing = 'left';
            if (placing=='left') var width = left; else var width = right;

            var
            columnCount = Math.floor(width / $(it.b.el).width()),
            itemsOnLevelCount = 0;
            
            for (var j=0; j<t.items.length; j++) {
                var it2 = t.items[j];
                if (it2.parent === it.parent && it2.level === it.level) itemsOnLevelCount++;
            };
            
            var
            rowCount = Math.floor(itemsOnLevelCount / columnCount);
            
            if (it.level===0) {
                columnCount = 1;
                rowCount = 9999;
            } else if (columnCount > rowCount) {
                columnCount = Math.floor(Math.sqrt(itemsOnLevelCount));
                rowCount = Math.floor(itemsOnLevelCount / columnCount);
            };
            rowCount++;
            
            var
            column = 0,
            columnIdx = 1;
            
            for (var j=0; j<t.items.length; j++) {
                var it2 = t.items[j];
                if (it2.parent === it.parent && it2.level === it.level) {
                    if ((it.levelIdx+1) <= (column * rowCount) + columnIdx) break;
                    if (columnIdx >= rowCount) {
                        column++;
                        columnIdx = 1;
                    } else columnIdx++;
                }
            };
            
            var           
			l = levels['path '+it.path];
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
                //levels['path '+it.path].offsetX = pl.offsetX;
				//levels['path '+it.path].offsetY = pl.offsetY;
                levels['path '+it.path].zIndexOffset = zof;
                l = levels['path '+it.path];
            };
            
  			it.childrenPlacement = placing;
            it.columnIdx = columnIdx;
            it.column = column;
            it.offsetX = (
                it.level === 1
                ? ($(it.b.el).width() + 20) * it.levelIdx
                : it.level === 2
                        ? placing==='right'
                            ? l.offsetX + parent.offsetX + ( ($(it.b.el).width()+20) * it.column) 
                            : l.offsetX + parent.offsetX - ( ($(it.b.el).width()+20) * it.column) 
                        : placing==='right'
                            ? l.offsetX + parent.offsetX + ( ($(it.b.el).width()+20) * it.column) + ($(it.b.el).width()/2)
                            : l.offsetX + parent.offsetX - ( ($(it.b.el).width()+20) * it.column) - ($(it.b.el).width()/2)
            );
            it.offsetY = (
                it.level === 1 
                ? 0
                : l 
                    ? it.level === 2
                        ? l.offsetY + parent.offsetY + ( ($(it.b.el).height()+20) * (it.columnIdx) ) 
                        : l.offsetY + parent.offsetY + ( ($(it.b.el).height()+20) * (it.columnIdx-1) ) + ($(it.b.el).height()/2)
                    : parent.offsetY + ( ($(it.b.el).height()+20) * it.columnIdx ) + 20
            );
            it.zIndex = (100 * 1000) + l.zIndexOffset;
            $(it.b.el).css({
                display : 'none',
                left : it.offsetX,
                top : it.offsetY,
                zIndex : it.zIndex
            });
            if (it.level===1) $(it.b.el).fadeIn('normal');
            $(it.b.el).fitText();
        }
        //debugger;
    }
    
    onmouseover(it) {
        var
        t = this,
        opLevMax = 1,
        opLevMin = 0.2;
        
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
                    $(li.it.b.el).stop(true,true).delay(200).animate({opacity:opLev},'fast');
                    hasChildren = true;
                }
            });
            
            $(it.li).parents('ul').each(function(idx,pul) {
                $(pul).children('li').each(function(idx2,cli){
                    var
                    opLev = opLevMin + (
                        (opLevMax-opLevMin) / cli.it.level
                    );
                    if (opLev >= 0 && opLev <= 1) {
                        if ($(cli.it.b.el).css('display')==='none') $(cli.it.b.el).css({display:'block',opacity:0});
                        $(cli.it.b.el).stop(true,true).delay(200).animate({opacity:opLev},'fast');
                    }
                });
                
                if (idx===0 && !hasChildren) $(pul).children('li').each(function(idx,cli){
                    if ($(cli.it.b.el).css('display')==='none') $(cli.it.b.el).css({display:'block',opacity:0});
                    $(cli.it.b.el).stop(true,true).delay(200).animate({opacity:1},'fast');
                });
            });

            $(it.path).stop(true,true).animate ({opacity:1},'fast');
            if (it.parent) t.items[it.parent].li.openChildren.each(function(idx,el){
                $(el.it.b.el).stop(true,true).animate ({opacity:1},'fast');
            });
            
            $('#'+it.b.el.id).stop(true,true).delay(200).animate ({opacity:1},'fast');
            
        }, 250);
    }
    
    onmouseout(it) {
        var
        t = this;
        //return false;
        //if (!t.timeoutMouseout) {
            if (t.timeoutMouseout) clearTimeout (t.timeoutMouseout);
            t.timeoutMouseout = setTimeout (function() {
                if (it.level>1) {
                    it.li.openChildren.each(function(idx,li) {
                        /*
                        for (var i=0; i<t.items.length; i++) {
                            var it2 = t.items[i];
                            if (it2.li === li) {
                                $(it2.b.el).fadeOut('slow');
                            }
                        }*/
                        $(li.it.b.el).fadeOut('slow');
                    });
                    //delete t.timeoutMouseout;
                    //if (it.parent) t.onmouseover(t.items[it.parent]);
                }
            }, 1500);
        //}
    }

}
