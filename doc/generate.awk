# a no-nonsense source-to-markdown generator which scans for:
#
# /**
#  * # foo
#  *
#  * this is markdown $(cat bar.md)
#  */
#
#  var foo; //  comment with 2 leading spaces is markdown too $(date)
#
# easily refactorable to hash-based languages (py/bash/perl/lua e.g.) 
# by changing the regexes
#
/\$\(/                   { cmd=$0; 
													 gsub(/^.*\$\(/,"",cmd); 
													 gsub(/\).*/,"",cmd);
													 cmd | getline stdout; close(cmd);
                           sub(/\$\(.*\)/,stdout);
                         } 
/\/\*\*/ 			           { doc=1; sub(/^.*\/\*/,""); }
doc && /\*\//            { doc=0;
							           	 sub(/[[:space:]]*\*\/.*/,"");
							           	 sub(/^[[:space:]]*\*[[:space:]]?/,"");
							           	 print
							           }
doc && /^[[:space:]]*\*/ { sub(/^[[:space:]]*\*[[:space:]]?/,""); 
													 print 
                         }
!doc && /\/\/  /         { sub(".*//  ",""); 
													 sub("# ","\n# ");
													 sub("> ","\n> ");
													 print
												 }
