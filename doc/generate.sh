#!/bin/sh 
set -e

mmark RFC_XR_Fragments.md         > RFC_XR_Fragments.xml
xml2rfc --v3 RFC_XR_Fragments.xml # RFC_XR_Fragments.txt
mmark --html RFC.template.md | grep -vE '(<!--{|}-->)' > RFC_XR_Fragments.html
#sed 's|visual-meta|<a href="https://visual-meta.org">visual-meta</a>|g' -i RFC_XR_Fragments.html
