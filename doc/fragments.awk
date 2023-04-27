BEGIN{
  print "| fragment | type | scope |"
  print "|----------|------|-------|"
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
  frag=$1
  $1=""
  if( $0 ~ /T_INT/ )             type="int"
  if( $0 ~ /T_STRING_OBJ/ )      type="[string object](string object)"
  if( $0 ~ /T_VECTOR2/ )         type="[vector2](#vector2)"
  if( $0 ~ /T_VECTOR3/ )         type="[vector3](#vector3)"
  if( $0 ~ /T_URL/ )             type="[url](#url)"
  if( $0 ~ /T_PREDEFINED_VIEW/ ) type="[predefined view](#prefined%20view)"
  print "| **"frag"** |" type "|" scope "|"
}
