cp package.json README.md lib/
rm -rf ./lib/types/__tests__
rm -rf ./lib/esm/__tests__

cat >lib/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >lib/esm/package.json <<!EOF
{
    "type": "module"
}
!EOF