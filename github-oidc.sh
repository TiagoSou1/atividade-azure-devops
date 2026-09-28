#!/usr/bin/env bash
set -euo pipefail
# Executar apos source /tmp/jogos-563531.env na mesma sessao.
az identity create -g "$RG" -n "$IDENTITY" --location "$LOCATION" --output none
CLIENT_ID=$(az identity show -g "$RG" -n "$IDENTITY" --query clientId -o tsv)
PRINCIPAL_ID=$(az identity show -g "$RG" -n "$IDENTITY" --query principalId -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)
WEBAPP_ID=$(az webapp show -g "$RG" -n "$WEBAPP" --query id -o tsv)
az identity federated-credential create -g "$RG" --identity-name "$IDENTITY" --name github-main --issuer https://token.actions.githubusercontent.com --subject repo:TiagoSou1@212193336/atividade-azure-devops@1393946001:ref:refs/heads/main --audiences api://AzureADTokenExchange --output none
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role 'Website Contributor' --scope "$WEBAPP_ID" --output none
printf 'AZURE_CLIENT_ID=%s\nAZURE_TENANT_ID=%s\nAZURE_SUBSCRIPTION_ID=%s\n' "$CLIENT_ID" "$TENANT_ID" "$SUBSCRIPTION_ID"
