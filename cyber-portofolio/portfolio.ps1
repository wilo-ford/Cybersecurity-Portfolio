param([ValidateSet('install','dev','build','check','preview','login','deploy','whoami')][string]$Action='dev')
$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
# Use a standard Node installation when present; otherwise the bundled Codex runtime.
$nodeCommand=Get-Command node.exe -ErrorAction SilentlyContinue
$nodePath=if($nodeCommand){$nodeCommand.Source}else{$null}
if(!$nodePath -or $nodePath -like '*\WindowsApps\*'){
  $bundles=Get-ChildItem -Path 'C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime*' -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending
  foreach($bundle in $bundles){
    $candidate=Join-Path $bundle.FullName 'dependencies\node\bin\node.exe'
    if(Test-Path -LiteralPath $candidate){$nodePath=$candidate;break}
  }
}
if(!$nodePath){throw 'Installez Node.js LTS puis relancez ce script.'}
$env:PATH=(Split-Path -Parent $nodePath)+';'+$env:PATH
$pnpmCommand=Get-Command pnpm.cmd -ErrorAction SilentlyContinue
$pnpmPath=if($pnpmCommand){$pnpmCommand.Source}else{$null}
if(!$pnpmPath){
  $bundleRoot=Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $nodePath))
  $candidate=Join-Path $bundleRoot 'bin\fallback\pnpm.cmd'
  if(Test-Path -LiteralPath $candidate){$pnpmPath=$candidate}
}
if(!$pnpmPath){throw 'Installez pnpm (https://pnpm.io/installation) puis relancez ce script.'}
$env:PATH=(Split-Path -Parent $pnpmPath)+';'+$env:PATH
switch($Action){
  'install' { & $pnpmPath install --frozen-lockfile }
  'login' { & $pnpmPath exec wrangler login }
  'whoami' { & $pnpmPath exec wrangler whoami }
  'deploy' { & $pnpmPath run check; if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}; & $pnpmPath run deploy }
  default { & $pnpmPath run $Action }
}
exit $LASTEXITCODE
