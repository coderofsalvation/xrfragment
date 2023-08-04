{ pkgs ? import <nixpkgs> {} }:

  pkgs.mkShell {
    # nativeBuildInputs is usually what you want -- tools you need to run
    nativeBuildInputs = with pkgs.buildPackages; [ 

      haxe
      python3
      nodejs-slim_20

      # extra
      php82
      mono
      jdk

    ];
}
