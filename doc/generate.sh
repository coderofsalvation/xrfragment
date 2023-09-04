#!/bin/sh 
set -e

mmark RFC_XR_Fragments.md         > RFC_XR_Fragments.xml
mmark --html RFC_XR_Fragments.md | grep -vE '(<!--{|}-->)' > RFC_XR_Fragments.html
xml2rfc --v3 RFC_XR_Fragments.xml # RFC_XR_Fragments.txt
sed -i 's/Expires: .*//g' RFC_XR_Fragments.txt
