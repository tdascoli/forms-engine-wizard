<?php class L {
const title = 'FormsEngine auf Deutsch';
const pagination_next = 'Weiter';
const pagination_back = 'Zurück';
const pagination_reset = 'Zurücksetzen';
const pagination_submit = 'Senden';
const pagination_createAnother = 'Weitere Antwort senden';
const message_stored = 'Ihre Daten wurden gespeichert.';
const message_email_subject = 'Neue Daten von FormsEngine';
const message_email_exception = 'Nachricht konnte nicht gesendet werden. Fehler:';
const element_select_default = '-bitte wählen-';
const element_yesno_yes = 'Ja';
const element_yesno_no = 'Nein';
public static function __callStatic($string, $args) {
    return vsprintf(constant("self::" . $string), $args);
}
}
function L($string, $args=NULL) {
    $return = constant("L::".$string);
    return $args ? vsprintf($return,$args) : $return;
}