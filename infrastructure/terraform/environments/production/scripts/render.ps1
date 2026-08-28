param(
  [Parameter(Mandatory = $false)]
  [ValidateSet('init', 'validate', 'plan', 'apply', 'output', 'destroy')]
  [string]$Action = 'plan'
)

$ErrorActionPreference = 'Stop'

$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '../../../../..')).Path
$EnvironmentDirectory = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$TerraformRoot = (Resolve-Path (Join-Path $EnvironmentDirectory '../..')).Path
$EnvFile = Join-Path $RepositoryRoot '.env'
$PlanFile = Join-Path $EnvironmentDirectory 'production.tfplan'
$TerraformCommand = Get-Command terraform -ErrorAction SilentlyContinue

if (-not $TerraformCommand) {
  throw 'Terraform nao foi encontrado no PATH. Instale o Terraform antes de continuar.'
}

if (-not (Test-Path $EnvFile)) {
  throw 'Arquivo .env nao encontrado na raiz do repositorio. Copie .env.example para .env e preencha RENDER_API_KEY e RENDER_OWNER_ID.'
}

Get-Content $EnvFile | ForEach-Object {
  $line = $_.Trim()

  if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith('#')) {
    return
  }

  $parts = $line.Split('=', 2)
  if ($parts.Count -ne 2) {
    throw "Linha invalida no .env: $line"
  }

  $name = $parts[0].Trim()
  $value = $parts[1].Trim().Trim('"').Trim("'")
  [Environment]::SetEnvironmentVariable($name, $value, 'Process')
}

foreach ($requiredVariable in @('RENDER_API_KEY', 'RENDER_OWNER_ID')) {
  $value = [Environment]::GetEnvironmentVariable($requiredVariable, 'Process')

  if ([string]::IsNullOrWhiteSpace($value) -or $value.Contains('REPLACE_ME')) {
    throw "$requiredVariable nao foi preenchido corretamente no arquivo .env da raiz."
  }
}

function Invoke-Terraform {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  & $TerraformCommand.Source @Arguments

  if ($LASTEXITCODE -ne 0) {
    throw "Terraform falhou com exit code $LASTEXITCODE."
  }
}

switch ($Action) {
  'init' {
    Invoke-Terraform @("-chdir=$EnvironmentDirectory", 'init')
  }
  'validate' {
    Invoke-Terraform @('fmt', '-check', '-recursive', $TerraformRoot)
    Invoke-Terraform @("-chdir=$EnvironmentDirectory", 'validate')
  }
  'plan' {
    Invoke-Terraform @(
      "-chdir=$EnvironmentDirectory",
      'plan',
      '-input=false',
      '-lock=false',
      "-out=$PlanFile"
    )

    Write-Host ''
    Write-Host "Plan criado em $PlanFile. Revise o resultado antes de executar apply." -ForegroundColor Cyan
  }
  'apply' {
    if (-not (Test-Path $PlanFile)) {
      throw 'production.tfplan nao encontrado. Execute primeiro: pnpm render:plan'
    }

    Invoke-Terraform @("-chdir=$EnvironmentDirectory", 'apply', $PlanFile)
  }
  'output' {
    Invoke-Terraform @("-chdir=$EnvironmentDirectory", 'output', 'frontend_urls')
  }
  'destroy' {
    Invoke-Terraform @("-chdir=$EnvironmentDirectory", 'destroy')
  }
}
