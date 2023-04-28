BEGIN{
  ROUNDROBIN="🎲"
  ASSET="🔒"
  OVERRIDE="🔓"
  PV_OVERRIDE="💥"
  BROWSER_OVERRIDE="👩"
  PROMPT="✋?"
  EMBED_OVERRIDE="🔗"
  print "| fragment | type | access       | scope |"
  print "|----------|------|--------------|-------|"
}

END{
  print ""
  print ASSET" = value(s) can only defined in 3D asset (immutable)<br>"
	print OVERRIDE" = value(s) can be overwritten in certain context<br>"
  print ROUNDROBIN" = multiple values will be roundrobin'ed (`#pos=0,0,0|1,0,0` e.g.)<br>"
  print PV_OVERRIDE" = value(s) can be overwritten by [predefined_view](#predefined_view)<br>"
  print BROWSER_OVERRIDE" = value(s) can be overwritten when user clicks `href` (value) or top-level URL change(see [How it works](#How%20it%20works))<br>"
  print EMBED_OVERRIDE" = value(s) can be overwritten when 3D asset is embedded/linked as `src` value<br>"
  print PROMPT" = value(s) can be overwritten by offering confirmation/undo to user<br><br>"
  print ""
	print "for more info see [How it works](#How%20it%20works)"
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
  perms = $0 ~ /OVERRIDE/ ? OVERRIDE : ASSET
  frag=$1
  $1=""
  if( $0 ~ /T_INT/             ) type="int"
  if( $0 ~ /T_STRING_OBJ/      ) type="[string object](string object      ) "
  if( $0 ~ /T_VECTOR2/         ) type="[vector2](#vector                  ) "
  if( $0 ~ /T_VECTOR3/         ) type="[vector3](#vector                  ) "
  if( $0 ~ /T_URL/             ) type="[url](#url                         ) "
  if( $0 ~ /T_PREDEFINED_VIEW/ ) type="[predefined view](#predefined_view ) "
  if( $0 ~ /ROUNDROBIN/        ) perms=perms" "ROUNDROBIN
  if( $0 ~ /PV_OVERRIDE/       ) perms=perms" "PV_OVERRIDE
  if( $0 ~ /BROWSER_OVERRIDE/  ) perms=perms" "BROWSER_OVERRIDE
  if( $0 ~ /EMBED_OVERRIDE/    ) perms=perms" "EMBED_OVERRIDE
  if( $0 ~ /PROMPT/            ) perms=perms" "PROMPT
  print "| **"frag"** |" type "|" perms "|" scope "|"
}
