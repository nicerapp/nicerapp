<?php
echo str_replace("\n",'<br/>', json_encode(mb_list_encodings(), JSON_PRETTY_PRINT));
?>
