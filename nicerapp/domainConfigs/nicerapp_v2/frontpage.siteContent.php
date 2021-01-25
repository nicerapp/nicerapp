    <h1 id="pageTitle">nicer.app web apps framework</h1>
<?php 
    global $cms;
    $apps = array(
        'newsHeadlines_englishNews' => array(
            //'#siteContent' => 'nicerapp/news/newsApp.siteContent.php?section=English%20News',
            //'news' => array ('section' => 'English_News')
            'news' => 'English_News'
        ),
        'newsHeadlines_englishNews_worldHeadlines' => array(
            //'#siteContent' => 'nicerapp/news/newsApp.siteContent.php?section=English%20News%20World%20Headlines',
            //'news' => array ('section' => 'English_News__World_Headlines')
            'news' => 'English_News__World_Headlines'
        ),
        'analytics' => array (
            'analytics' => array()
        )
        
    );
    $json = array();
    $urls = array();
    foreach ($apps as $appName => $appSettings) {
        $json[$appName] = json_encode($appSettings);
        $urls[$appName] = '/apps/'.base64_encode_url($json[$appName]);
    };
?>
    <h2>Available Apps</h2>
    
    <ul>
        <li><a href="<?php echo $urls['newsHeadlines_englishNews'];?>">English News</a></li>
        <li><a href="<?php echo $urls['newsHeadlines_englishNews_worldHeadlines'];?>">English News : World Headlines only</a></li>
    </ul>
    <br/>
    <!--
    
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula metus ultrices tortor scelerisque, ac rhoncus nisl ullamcorper. Vestibulum lacinia venenatis felis, sed viverra augue consequat ac. In nec finibus augue, non dictum odio. Cras a tortor vitae lacus dictum consectetur. Sed efficitur nisl id nisi dictum laoreet. Nullam massa ligula, malesuada vitae mauris vitae, pretium eleifend urna. Aliquam vitae lobortis sapien. Nunc lacus quam, fringilla ut pulvinar eget, molestie at tellus. Praesent egestas lacus elit, scelerisque fringilla enim ornare sed. Nunc a ex a erat posuere ultricies ac venenatis est. Sed sapien sem, commodo quis pellentesque in, mattis ac erat. Praesent quis dignissim lacus, sed dignissim sem. Aliquam erat volutpat. Sed maximus ultrices est, eu lacinia mi euismod vitae.
    </p><p>
    Nullam tristique risus a lobortis tincidunt. Praesent molestie, tellus quis auctor porttitor, neque augue pharetra erat, at ornare tellus nulla ac tellus. Sed cursus augue ac est tempus, id ultrices ante varius. Suspendisse eu eleifend lectus, eget vulputate mauris. Suspendisse arcu dolor, vehicula nec ex ac, mollis semper ante. Morbi sit amet felis sit amet elit pretium rutrum. Proin pulvinar massa in aliquam luctus. Fusce ac viverra lacus. Praesent leo felis, tristique eu sem non, laoreet imperdiet elit. Nullam tristique lorem ante, sed suscipit turpis feugiat et. In hac habitasse platea dictumst. Donec a magna ac est cursus faucibus ac quis orci.
    </p><p>

    Proin venenatis elit lorem, id pellentesque turpis volutpat eu. Curabitur posuere, metus convallis tincidunt porttitor, erat orci tempor risus, a posuere purus lacus sit amet erat. Quisque ac ex vestibulum, vehicula turpis sit amet, ullamcorper turpis. In feugiat auctor orci ac fringilla. Sed tincidunt suscipit tincidunt. Mauris id metus et velit auctor auctor. In venenatis cursus lacinia. Nam eu eleifend quam, a rutrum orci. Nam malesuada venenatis feugiat.
    </p><p>

    Pellentesque convallis, risus et tempor cursus, velit est accumsan tellus, vel vestibulum massa lacus dapibus neque. Aliquam non neque sed ipsum luctus laoreet. Integer ac odio pulvinar, molestie erat sit amet, suscipit urna. Aenean eros nisl, maximus viverra magna vel, elementum pretium ligula. Vestibulum ligula est, tincidunt vestibulum dignissim vitae, vestibulum aliquet augue. Ut congue vitae orci at sollicitudin. Phasellus tellus lorem, volutpat at nunc vel, aliquet rhoncus quam. Mauris enim tortor, blandit a accumsan sit amet, gravida sit amet libero.
    </p><p>

    Etiam nibh justo, tempus eu ex et, pharetra rutrum mi. Donec facilisis, risus non ornare mattis, augue leo iaculis tortor, nec cursus justo justo vel mauris. Duis sapien orci, consectetur non sem sit amet, dapibus interdum sem. Maecenas hendrerit condimentum mi, nec molestie neque. Sed maximus vitae metus sed auctor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis at sapien id erat venenatis lacinia vitae vel diam. Praesent maximus, libero vel lacinia euismod, metus urna fringilla sem, non egestas leo neque vitae nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus euismod, nisi tempus blandit varius, sapien nibh accumsan eros, nec laoreet libero turpis id massa. Quisque eget dolor ac felis mattis facilisis. Maecenas finibus, dui sagittis ullamcorper fermentum, arcu quam aliquet risus, ac efficitur quam ex vel nisi.
    </p><p>

    Vestibulum quis nulla rhoncus, finibus felis vel, tempor tellus. Maecenas at blandit diam, in consequat eros. Donec volutpat a lectus ac congue. Nam pretium lectus sed arcu vulputate, vel scelerisque dolor imperdiet. Morbi nec lacus ac nulla mattis consectetur. Cras fringilla fringilla tellus sit amet venenatis. Aenean ut convallis est. Fusce ultrices, turpis at viverra vestibulum, eros libero cursus neque, nec mollis nunc odio id ligula. Pellentesque ac nibh quis eros aliquet porta ornare at sapien. Aliquam volutpat sapien eu tortor fringilla vulputate eu nec nunc. Etiam hendrerit massa at dui feugiat bibendum. Vestibulum bibendum tincidunt sem, non efficitur nisl blandit a. Phasellus volutpat efficitur ipsum vitae tincidunt.
    </p><p>

    Mauris placerat nibh interdum nulla pretium lobortis. Nulla tincidunt dictum tempor. Vestibulum condimentum hendrerit sollicitudin. Sed venenatis lobortis sodales. Suspendisse eget enim metus. Quisque semper, dui ut fermentum mattis, ipsum turpis sodales est, eu fringilla neque lectus et dui. Mauris sit amet lacus maximus, lacinia augue nec, euismod ligula. Morbi facilisis, velit id venenatis placerat, massa ipsum tempus est, nec suscipit nibh ante vel dolor.
    </p><p>

    Curabitur rutrum a ante sit amet egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed quis purus quis mi efficitur pellentesque eget sed magna. Donec aliquam viverra aliquam. Maecenas dapibus rutrum maximus. Aenean id elit efficitur, bibendum velit ut, venenatis eros. Ut sem erat, ultrices imperdiet aliquam nec, dictum non neque. Aenean at vulputate neque. Donec tellus neque, pretium in pharetra eu, pulvinar id risus. Etiam quis scelerisque ligula. Donec vehicula ultrices sem, in cursus risus blandit nec. Proin molestie gravida dui et scelerisque.
    </p><p>

    Morbi blandit finibus augue, ut dignissim leo bibendum vel. Nulla ut neque ac odio auctor porttitor eget vel orci. Praesent dapibus consectetur lectus, sit amet volutpat ligula placerat eget. Nunc dignissim enim diam, ac vestibulum est aliquet et. Integer dignissim non sem sed ullamcorper. Vivamus nunc nisl, tempus vitae nibh a, molestie efficitur ex. Mauris ut scelerisque dui, vulputate pellentesque quam. Quisque sit amet imperdiet dui, a sollicitudin erat. Curabitur interdum diam in dolor accumsan molestie. Integer semper eros eu erat fringilla, quis elementum turpis sagittis.
    </p><p>

    Nulla eu elit sed ante finibus pellentesque eu ut nibh. Maecenas nec molestie risus, vel sollicitudin mauris. Etiam mollis blandit turpis. Aliquam vestibulum tortor sollicitudin, tincidunt odio non, laoreet diam. Sed vehicula urna leo, in ultricies ligula bibendum non. Duis eget scelerisque mi, quis fermentum turpis. Nam vitae quam sed turpis dignissim volutpat vel sed nibh. Etiam eget nisl in quam eleifend convallis ac non nunc. Cras eleifend augue in dui lobortis, sit amet ultricies mi vestibulum. Ut quis ipsum convallis lectus feugiat ullamcorper eget at nulla. Morbi pulvinar, dui et rhoncus aliquam, nibh tellus pellentesque arcu, a iaculis lectus diam vel sem. Proin tempor tortor at cursus sollicitudin.
    </p><p>

    Phasellus feugiat ullamcorper viverra. Donec augue arcu, imperdiet ut tincidunt sed, condimentum id nunc. Mauris semper velit nec ipsum luctus viverra. In ut dui arcu. Mauris sed enim libero. Pellentesque rhoncus felis diam, eu euismod dui varius ut. Nam a lorem tincidunt, finibus lorem in, laoreet ligula. Nulla lacinia auctor dapibus. Vivamus vel laoreet orci, sit amet faucibus mauris. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec non urna scelerisque, fermentum lorem vel, posuere metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec dictum lobortis semper. Nullam egestas placerat ligula, scelerisque dapibus risus. In viverra gravida mi at molestie.
    </p><p>

    Morbi vel sapien et leo efficitur cursus. Maecenas aliquet tincidunt leo, ut auctor mi vehicula eget. Etiam efficitur, nulla quis fringilla consectetur, odio sapien eleifend justo, sed eleifend ligula quam quis magna. Sed consequat vitae leo nec cursus. Sed ac dolor tristique, dictum tortor at, volutpat sem. Aenean vitae nisi bibendum, rutrum ex at, ullamcorper ligula. Integer id rutrum massa. Nunc maximus ultricies nisl vulputate auctor. Quisque non ex purus. Vestibulum ut porttitor mi. Donec enim turpis, dictum sit amet tincidunt ut, vestibulum vel odio. Donec vehicula ipsum sed velit finibus hendrerit. Donec tristique interdum diam sed consequat. Suspendisse potenti. Fusce imperdiet pulvinar ultricies.
    </p><p>

    Curabitur in ex ac sem rhoncus euismod. Maecenas varius suscipit nunc sed fermentum. Nam pharetra tincidunt nibh et molestie. Aenean lacinia maximus scelerisque. Cras luctus dolor eu elit euismod ornare. Nulla quis malesuada urna, eu molestie nisi. Nullam efficitur et diam eget pretium. Phasellus blandit rutrum tellus, non accumsan justo iaculis sed. Integer porta augue augue, accumsan elementum tellus elementum laoreet. Donec id tellus sagittis, pharetra augue in, commodo ex. Maecenas convallis a neque eu imperdiet. Fusce vulputate, arcu sit amet accumsan dictum, est erat semper turpis, nec pulvinar ex dui eget mi. Aenean interdum mattis augue, nec blandit purus vulputate sed. Nam sit amet tortor feugiat mauris auctor luctus vitae in odio. Vivamus in dui porta, bibendum felis vitae, imperdiet felis.
    </p><p>

    Morbi vestibulum tempor mauris a ultricies. Integer euismod pretium nibh, non ultricies nisi. Ut iaculis cursus ligula eget pretium. Aenean non nisi quis nisi tempor iaculis. Vestibulum non mauris tristique, vulputate felis eu, sollicitudin lacus. Donec accumsan tellus ex, at iaculis augue tristique ut. Phasellus tempor viverra lacus. Phasellus a ante ligula. Fusce vestibulum porttitor facilisis. Nullam enim lectus, dapibus tincidunt scelerisque quis, congue sit amet elit. Pellentesque vitae ultricies lorem. Proin egestas lacus et lectus fringilla mollis. Fusce mollis, sem et bibendum faucibus, nibh dui semper neque, a tincidunt elit ligula a mauris. Pellentesque dapibus lacus at interdum faucibus.
    </p><p>

    Curabitur magna urna, feugiat ut fringilla eu, dignissim ut augue. Integer sit amet commodo tellus. Nulla gravida quis sem ut rutrum. Mauris porta, nisl sed imperdiet accumsan, enim velit sagittis orci, id pretium enim ligula in purus. Nam tempor sit amet arcu vehicula ullamcorper. Suspendisse vehicula ultrices dui, id feugiat ipsum sagittis sit amet. Nulla tincidunt cursus nibh, sit amet condimentum eros elementum sit amet. Donec rhoncus metus vitae nisl pellentesque blandit.
    </p><p>

    Donec condimentum diam ut varius gravida. Vivamus egestas eget ipsum eget sagittis. Duis cursus nibh at lacinia interdum. Donec eu ligula orci. Duis a lectus aliquet dolor suscipit tempus vel in tortor. Suspendisse feugiat ultrices nunc, quis aliquet dolor efficitur sit amet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut a dui facilisis, lobortis est ut, vestibulum felis. Sed dapibus, ex convallis molestie interdum, risus justo pharetra sem, ullamcorper consectetur risus dui malesuada velit. Maecenas tempor tortor sed condimentum sollicitudin.
    </p><p>

    Suspendisse vestibulum faucibus nibh in commodo. Ut ut eros facilisis, placerat dui at, sodales massa. Nulla porttitor mattis sapien, in ultrices risus mattis molestie. Aliquam mollis ex at congue auctor. Donec dictum convallis lectus at hendrerit. Sed quis odio sed leo semper facilisis at nec nunc. Ut aliquet, metus quis feugiat tincidunt, nisi ex volutpat turpis, at interdum lectus sem id ligula. In hac habitasse platea dictumst. Etiam id bibendum metus. Suspendisse non mollis massa, non luctus sapien. Donec euismod justo at nulla hendrerit, faucibus molestie diam efficitur. Mauris eu purus turpis. Phasellus condimentum, sapien ac porttitor congue, eros nunc fringilla nibh, vitae vestibulum mauris nisl ac mauris. Proin sollicitudin, dolor vel suscipit efficitur, elit ex elementum libero, at consectetur augue elit id elit. Suspendisse aliquet dolor ac sapien convallis, in rutrum velit scelerisque.
    </p><p>

    Aliquam blandit massa orci, nec vulputate eros ullamcorper id. Integer sit amet luctus enim. Duis vulputate interdum metus a mattis. Quisque nibh tellus, posuere eu lacus at, rutrum luctus risus. In varius ipsum eget dignissim mollis. Maecenas malesuada, nulla sit amet tristique vestibulum, augue nunc sodales sapien, vel convallis mauris ante eu odio. Vestibulum tristique felis purus, id rhoncus purus pharetra ac. Mauris laoreet commodo dolor id volutpat. Duis lacus mi, auctor non molestie id, luctus at ex. Mauris ac risus sit amet mauris convallis congue sit amet ut libero.
    </p><p>

    Fusce a risus eu dui iaculis imperdiet. Aliquam et venenatis nisl. Suspendisse sollicitudin quis augue eget aliquam. Nam interdum eros in libero venenatis, vel pulvinar metus rutrum. Praesent elementum lorem eu elit gravida, eget rutrum justo fermentum. Fusce eget leo enim. Proin cursus, ipsum ut accumsan tempus, ligula risus vulputate nisi, in aliquam orci ex et sapien. Aliquam porta dictum lobortis. Aliquam erat volutpat. Ut non tortor dictum, malesuada augue nec, pretium eros. In ac lorem bibendum nisi pretium eleifend. Proin ut nisi eget risus laoreet tempor. Vivamus vitae nisi augue. Vestibulum vel fringilla ante. Etiam hendrerit libero sit amet diam vehicula, sit amet fermentum justo iaculis.
    </p><p>

    Mauris ullamcorper fringilla lacus vitae sollicitudin. Etiam tincidunt sapien eu ex blandit, at volutpat augue dignissim. Vestibulum volutpat hendrerit laoreet. Mauris sodales, lorem in efficitur volutpat, nisi orci tristique sapien, at tincidunt tortor sem in leo. Nunc faucibus id eros vel molestie. Nulla at libero et nunc posuere auctor. Integer velit urna, rutrum eget egestas vel, pellentesque quis turpis. Nam accumsan dui eget mauris dapibus, et vestibulum neque pharetra. Duis dapibus aliquet posuere. Maecenas sodales, dolor ut maximus consectetur, turpis nulla feugiat mi, ac pellentesque odio lectus a ipsum. Integer pharetra ex eu arcu convallis imperdiet. Vestibulum aliquet est tempor odio venenatis, sed posuere eros ultrices. Maecenas faucibus blandit ante, sed sollicitudin est sodales id. Pellentesque quis varius massa. Mauris eget cursus eros. Suspendisse volutpat quam eget dolor gravida, ut suscipit elit rutrum.    
    </p>
    -->
