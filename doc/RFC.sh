#!/bin/sh 
set -e
mmark RFC.template.md             > RFC_XR_Fragments.xml
mmark --html RFC.template.md      > RFC_XR_Fragments.html
xml2rfc --v3 RFC_XR_Fragments.xml # RFC_XR_Fragments.txt
