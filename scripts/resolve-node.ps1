param(
  [string]$ScriptPath,
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ScriptArguments
)

$ErrorActionPreference = "Stop"

function Test-NodeCandidate {
  param([string]$Candidate)
  if ([string]::IsNullOrWhiteSpace($Candidate)) { return $null }
  if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
    return (Resolve-Path -LiteralPath $Candidate).Path
  }
  return $null
}

$nodePath = Test-NodeCandidate $env:NODE_EXE

if (-not $nodePath) {
  $command = Get-Command node -ErrorAction SilentlyContinue
  if ($command) { $nodePath = $command.Source }
}

if (-not $nodePath) {
  $candidates = @(
    "$env:ProgramFiles\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:LOCALAPPDATA\Volta\bin\node.exe",
    "$env:USERPROFILE\scoop\apps\nodejs\current\node.exe"
  )
  foreach ($candidate in $candidates) {
    $nodePath = Test-NodeCandidate $candidate
    if ($nodePath) { break }
  }
}

if (-not $nodePath) {
  throw "Node.js nao foi encontrado. Defina NODE_EXE ou instale Node.js 20+ em um caminho normal do Windows. Nenhum runtime interno do Codex sera usado ou instalado automaticamente."
}

if (-not $ScriptPath) {
  & $nodePath --version
  exit $LASTEXITCODE
}

& $nodePath $ScriptPath @ScriptArguments
exit $LASTEXITCODE
