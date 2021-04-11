{{/* vim: set filetype=mustache: */}}

{{- define "Helpers.app_name" -}}
  {{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "Helpers.chart" -}}
  {{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "Helpers.namespace" -}}
  {{ .Chart.Name | trunc 63 }}
{{- end -}}

{{- define "Helpers.release_fullname" -}}
  {{- .Release.Name | replace "." "-" | trunc 63 -}}
{{- end -}}
