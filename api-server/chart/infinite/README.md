### Helm overview

[Usage](https://github.com/kubernetes/helm/blob/master/docs/using_helm.md)

[Template Guide](https://github.com/kubernetes/helm/tree/master/docs/chart_template_guide)

### Install package

`helm upgrade --install infinite.staging chart/infinite -f chart/infinite/values.staging.yaml --namespace infinite`

### Render templates

`helm install chart/infinite --debug --dry-run -f chart/infinite/values.staging.yaml --name infinite.staging`

### Helm history

`helm history infinite.staging`

### Get values used for running revision

`helm get values --revision=2 infinite.staging`

### Status of revision

`helm status infinite.staging --revision 2`

### Get rendered template for release

`helm get manifest infinite.staging --revision 2`

### Delete Chart

`helm delete --purge infinite.staging`
