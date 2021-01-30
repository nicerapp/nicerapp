<?php 
require_once (dirname(__FILE__).'/functions.php');

$URLs_json = array (
    'analytical and numerical mathmatics' => array (
        'text_filesystem' => array (
            'user' => 'anyone',
            'articleFile' => ':SITE_ROOT:/jsEngineeringMath/math_analyticalAndNumerical_documentation.php'
        )
    ),
    'wave physics' => array (
        'text_filesystem' => array (
            'user' => 'anyone',
            'articleFile' => ':SITE_ROOT:/jsEngineeringMath/physics_waves_documentation.php'
        )
    )
);

$URLs = array();
foreach ($URLs_json as $URL_id => $URL_data) {
    $URLs[$URL_id] = base64_encode_url(json_encode($URL_data));
};
?>
<h1>jsEngineeringMath (UNDER CONSTRUCTION)</h1>
<h2>a complete set of math routines in javascript, using JSON data, for secondary technical education</h2>

<h3>Definitions of symbols (in Unicode)</h3>
<p>
    &#x2115; are the <i>natural numbers</i> (0, 1, 2, 3, 4, 5, and so on).<br/>
    &#x2115;&#x207A; are the natural numbers excluding 0.<br/>
    &#x2124; are the <i>whole numbers</i> (0, -1, 1, -2, 2, -3, 3, and so on).<br/>
    &#x2124;&#x207A; are the whole numbers larger than 0.<br/>
    &#x2124;&#x207B; are the whole numbers under 0.<br/>
    &#x211A; are the <i>rational numbers</i>.<br/>
    &#x211A;&#x207A; are the rational numbers that are larger than 0.<br/>
    &#x211A;&#x207B; are the rational numbers under 0.<br/>
    &#x211D; are the <i>real numbers</i>.<br/>
    &#x211D;&#x207A; are the real numbers that are larger than 0.<br/>
    &#x211D;&#x207B; are the real numbers under 0.<br/>
</p>

<p>
    &#x2282;A is the <i>domain</i> A.<br/>
</p>
