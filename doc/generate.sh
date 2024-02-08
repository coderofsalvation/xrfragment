#!/bin/sh 
set -e

for topic in Fragments Macros; do
  mmark RFC_XR_$topic.md         > RFC_XR_$topic.xml
  mmark --html RFC_XR_$topic.md | grep -vE '(<!--{|}-->)' > RFC_XR_$topic.html
  xml2rfc --v3 RFC_XR_$topic.xml # RFC_XR_$topic.txt
  sed -i 's/Expires: .*//g' RFC_XR_$topic.txt
  convert -size 700x2400 xc:white -font "FreeMono" +antialias -pointsize 12 -fill black -annotate +15+15 "@RFC_XR_Fragments.txt" -colorspace gray +dither -posterize 6 RF6_XR_Fragments.png
done
