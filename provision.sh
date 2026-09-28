#!/usr/bin/env bash
set -euo pipefail
# Execute no Azure Cloud Shell (Bash). Nao habilite set -x: protege segredos.
export RG=rg-jogos-563531-0928
export LOCATION=brazilsouth
export SQL_SERVER=sql-jogos-563531-0928
export DB_NAME=jogosdb
export DB_USER=sqladmin
export PLAN=plan-jogos-563531-0928
export WEBAPP=web-jogos-563531-0928
export AI=ai-jogos-563531-0928
export LAW=law-jogos-563531-0928
export IDENTITY=id-github-jogos-563531
export SUBSCRIPTION_ID=813cbd76-3b78-4970-a2a6-648cc69d9b40
az account set --subscription "$SUBSCRIPTION_ID"
export DB_PASSWORD="$(openssl rand -hex 20)Aa1!"
export DB_SERVER="$SQL_SERVER.database.windows.net"
umask 077
declare -p RG LOCATION SQL_SERVER DB_SERVER DB_NAME DB_USER DB_PASSWORD PLAN WEBAPP AI LAW IDENTITY SUBSCRIPTION_ID > /tmp/jogos-563531.env
az group create --name "$RG" --location "$LOCATION" --tags atividade=azure-devops rm=563531 --output none
az sql server create --name "$SQL_SERVER" --resource-group "$RG" --location "$LOCATION" --admin-user "$DB_USER" --admin-password "$DB_PASSWORD" --output none
az sql db create --resource-group "$RG" --server "$SQL_SERVER" --name "$DB_NAME" --service-objective Basic --backup-storage-redundancy Local --output none
# 0.0.0.0 permite servicos Azure; evita liberar todos os enderecos da Internet.
az sql server firewall-rule create --resource-group "$RG" --server "$SQL_SERVER" --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 --output none
az appservice plan create --name "$PLAN" --resource-group "$RG" --sku F1 --location "$LOCATION" --output none
az webapp create --name "$WEBAPP" --plan "$PLAN" --resource-group "$RG" --runtime 'NODE:22LTS' --output none
az webapp update --name "$WEBAPP" --resource-group "$RG" --https-only true --output none
az monitor log-analytics workspace create --resource-group "$RG" --workspace-name "$LAW" --location "$LOCATION" --retention-time 30 --output none
WORKSPACE_ID=$(az monitor log-analytics workspace show -g "$RG" -n "$LAW" --query id -o tsv)
az extension add --name application-insights --only-show-errors
az monitor app-insights component create --app "$AI" --location "$LOCATION" --kind web -g "$RG" --application-type web --workspace "$WORKSPACE_ID" --output none
AI_CONNECTION=$(az monitor app-insights component show -g "$RG" --app "$AI" --query connectionString -o tsv)
az webapp config appsettings set -g "$RG" -n "$WEBAPP" --settings DB_SERVER="$DB_SERVER" DB_NAME="$DB_NAME" DB_USER="$DB_USER" DB_PASSWORD="$DB_PASSWORD" APPLICATIONINSIGHTS_CONNECTION_STRING="$AI_CONNECTION" WEBSITE_NODE_DEFAULT_VERSION='~22' SCM_DO_BUILD_DURING_DEPLOYMENT=false --output none
echo 'Infraestrutura e variaveis configuradas. Senhas omitidas.'
az resource list -g "$RG" --query '[].{Nome:name,Tipo:type,Regiao:location}' -o table
