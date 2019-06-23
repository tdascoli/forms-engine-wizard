# architecture


[data::json, csv, xls(x)   ]
              |
              V
[mapper::data to answers   ]  ->  [mapper::data to forms   ]
              |                                 |
              V                                 |
[answers::internal         ]                    |
              A                                 |
              |                                 |
[questions::internal       ]                    |
              A                                 |
              |                                 |
[forms::json               ]  <-----------------+
              |
              V
[forms::presentation       ]  (nextcloud -> users/groups/public)