$dtk(function () {
    var tp = $dtk('meta[pagetype]');
    if (tp.length != 1) {
        return;
    }

    var  bizParamList = [
        'pagetype',
        'sproductid',
        'topic_id',
        'note_id',
        'sellerid',
        'liveid',
        'activity_id',
        'zhuhe_product_id',
        'coupon_id',
        'coupon_package_id',
        'kjt_id',
        'keyword',
        'bannerid',
        'target_url',
        'action_param',
        'yht_id',
        'subject_id',
        'note_subject_id',
        'hot_subject_id',
        'share_id',
        'ref_share_id',
        'ref_note_id' ,
        'ztnote_id',
        {'domName':  '_target', ylogName: 'target'},
        'key_id',
        'action_type',
        'orderid',
        'shippingid',
        'discount_id',
        'pricerange',
        'countryid',
        'countrygroup_id',
        'tab_id',
        'note_user_id',
        'category_id',
        'brand_id',
        'label_id',
        'seller_promotion_id',
        'target_note_id',
        'target_userid',
        'target_object_id',
        'target_object_type',
        'qa_id'
    ];

    if (bizParamList.length == 0) {
        return;
    }

    var commObj = {};
    bizParamList.forEach(function(p){
        if(typeof(p) ==   'string'){
            if ($dtk(tp[0]).attr(p)){
                commObj[p] = $dtk(tp[0]).attr(p);
            }
        } else if(typeof(p) == 'object'){
            if ($dtk(tp[0]).attr(p.domName)){
                commObj[p.ylogName] = $dtk(tp[0]).attr(p.domName);
            }
        }
    });


    function _getSpm(el){
        var spmObj = null;

        var tarEl = $dtk(el).closest('[_target]');
        var miEl = $dtk(el).closest('[module_index]');
        var module_index_val;

        if (miEl.length > 0) {
            spmObj = spmObj || {};

            module_index_val = miEl.first().attr('module_index');

            var mnEl = $dtk(miEl[0]).closest('[module_name]');
            var smnEl = $dtk(miEl[0]).closest('[sub_module_name]');

            bizParamList.forEach(function(p){
                if(typeof(p) ==   'string'){
                    if ($dtk(miEl[0]).attr(p)){
                        spmObj[p] = $dtk(miEl[0]).attr(p);
                    }
                } else if(typeof(p) == 'object'){
                    if ($dtk(miEl[0]).attr(p.domName)){
                        spmObj[p.ylogName] = $dtk(miEl[0]).attr(p.domName);
                    }
                }
            });

            if(tarEl.length > 0){
                bizParamList.forEach(function(p){
                    if(typeof(p) ==   'string'){
                        if ($dtk(tarEl[0]).attr(p)){
                            spmObj[p] = $dtk(tarEl[0]).attr(p);
                        }
                    } else if(typeof(p) == 'object'){
                        if ($dtk(tarEl[0]).attr(p.domName)){
                            spmObj[p.ylogName] = $dtk(tarEl[0]).attr(p.domName);
                        }
                    }
                });
            }

            if (mnEl.length > 0) {
                spmObj['module_name'] = $dtk(mnEl[0]).attr('module_name');
                spmObj['part_id'] = $dtk(mnEl[0]).attr('part_id');
            }
            if (smnEl.length > 0) {
                spmObj['sub_module_name'] = $dtk(smnEl[0]).attr('sub_module_name');
            }

            if (module_index_val) {
                spmObj['module_index'] = module_index_val;
            } else {
                //计算module_index
                var o_module_list = [];
                if (smnEl.length > 0) {
                    o_module_list = smnEl[0].querySelectorAll('[module_index]');
                } else if (mnEl.length > 0) {
                    o_module_list = mnEl[0].querySelectorAll('[module_index]');
                }

                if (o_module_list.length == 0) {
                    o_module_list = [miEl[0]];
                }

                if (o_module_list.length > 0) {
                    for (var i = 0; i < o_module_list.length; i++) {
                        if (o_module_list[i] == miEl[0]) {
                            spmObj['module_index'] = i + 1;
                            break;
                        }
                    }
                }
            }

        }

        return spmObj;

    }

    function _bindClick(evt){
        var target = evt.target;
        var spmObj = _getSpm(target);

        if(spmObj){
            var action_type = spmObj['action_type'];
            if(!action_type){
                spmObj['action_type'] = 'click';
            }

            _dc_('send', spmObj);
        }
    }


    function _bindExpose(evt){
        var target = evt._args;
        var spmObj = _getSpm(target);

        if(!spmObj){
            var deepEl = target.querySelectorAll('[module_index]');
            if(deepEl){
                spmObj = _getSpm(deepEl[0]);
            }
        }

        if(spmObj){
            spmObj['action_type'] = 'scroll';
            _dc_('send', spmObj);
        }
    }


    _dc_('fillCommon', commObj);
    _dc_('send', {'action_type': 'show'});

    document.addEventListener('click', _bindClick, true);

    window.removeEventListener('ymtexposure', window['ymtexposureHandle']);
    window.addEventListener('ymtexposure', _bindExpose);

    var expList = window['ymtexposureList'];
    var i = 0;
    var l = 0;

    if(expList){
        l = expList.length;
    }

    function exposeCache(){
        if(i < l){
            _bindExpose( expList[i])
            i++;
            setTimeout(exposeCache, 200);
        }       
    }

    exposeCache();

    _dc_('on', 'load_more_fn', function (p) {
        p['action_type'] = 'load_more';
        _dc_('send', p);
    });
});
