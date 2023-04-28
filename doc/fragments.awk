BEGIN{
  ROUNDROBIN="🎲"
  ASSET="🔒"
  PV_OVERRIDE="🔓"
  BROWSER_OVERRIDE="👩"
  PROMPT="✋?"
  print ROUNDROBIN" = multiple values will be roundrobin'ed<br>"
  print ASSET" = immutable value(s) are defined in 3D asset<br>"
  print PV_OVERRIDE" = value(s) can be overwritten by [predefined_view](#predefined_view)<br>"
  print BROWSER_OVERRIDE" = value(s) can be overwritten by [URL browser_override](#browser_override)<br>"
  print PROMPT" = value(s) can be overwritten only after confirmation of user<br><br>"
  print "| fragment | type | write access | scope |"
  print "|----------|------|--------------|-------|"
}

/category:/    {
  $1=$2=""
  sub(/^[[:space:]]+/, "", $0 )    # remove leading spaces
  sub(/[[:space:]]+$/, "", $0 )    # remove trailing spaces
  scope=$0
}


/Frag.*XRF\.*/ {
  gsub(/.*\("/,"",$1)
  gsub(/".*/,"",$1)
  type="string"
  perms=""
  frag=$1
  $1=""
  if( $0 ~ /T_INT/             ) type="int"
  if( $0 ~ /T_STRING_OBJ/      ) type="[string object](string object      ) "
  if( $0 ~ /T_VECTOR2/         ) type="[vector2](#vector                  ) "
  if( $0 ~ /T_VECTOR3/         ) type="[vector3](#vector                  ) "
  if( $0 ~ /T_URL/             ) type="[url](#url                         ) "
  if( $0 ~ /T_PREDEFINED_VIEW/ ) type="[predefined view](#predefined_view ) "
  if( $0 ~ /ROUNDROBIN/        ) perms=perms" "ROUNDROBIN
  if( $0 ~ /ASSET/             ) perms=perms" "ASSET
  if( $0 ~ /PV_OVERRIDE/       ) perms=perms" "PV_OVERRIDE
  if( $0 ~ /BROWSER_OVERRIDE/  ) perms=perms" "BROWSER_OVERRIDE
  if( $0 ~ /PROMPT/            ) perms=perms" "PROMPT
  print "| **"frag"** |" type "|" perms "|" scope "|"
}
