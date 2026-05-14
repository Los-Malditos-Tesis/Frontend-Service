import { useMemo, useState, useRef } from "react";
import DashboardLayout from "../containers/Dashboard/DashboardLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
const TOKEN_SOURCES = {
  NONE: "none",
  LOCAL_STORAGE: "local_storage",
  CUSTOM: "custom",
};

const buildHeadersObject = (headers) => {
  const result = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const shouldSendBody = (method) => !["GET", "HEAD"].includes(method);

export default function ApiTestPage() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [tokenSource, setTokenSource] = useState(TOKEN_SOURCES.NONE);
  const [customToken, setCustomToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef(null);

  const showBodyInput = useMemo(() => shouldSendBody(method), [method]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setResponseData(null);

    if (!url.trim()) {
      setErrorMessage("Debes ingresar una URL.");
      return;
    }

    const headers = {
      Accept: "application/json",
    };

    let selectedToken = "";
    if (tokenSource === TOKEN_SOURCES.LOCAL_STORAGE) {
      selectedToken = localStorage.getItem("token") || "";
      if (!selectedToken) {
        setErrorMessage('No se encontro un token en localStorage con la llave "token".');
        return;
      }
    }

    if (tokenSource === TOKEN_SOURCES.CUSTOM) {
      selectedToken = customToken.trim();
      if (!selectedToken) {
        setErrorMessage("Debes ingresar un bearer token personalizado.");
        return;
      }
    }

    if (selectedToken) {
      headers.Authorization = `Bearer ${selectedToken}`;
    }

    const fetchOptions = {
      method,
      headers,
    };

    if (showBodyInput && body.trim()) {
      try {
        const parsedBody = JSON.parse(body);
        fetchOptions.body = JSON.stringify(parsedBody);
        headers["Content-Type"] = "application/json";
      } catch {
        setErrorMessage("El body debe ser JSON valido.");
        return;
      }
    }

    const startedAt = performance.now();
    setLoading(true);

    try {
      const response = await fetch(url.trim(), fetchOptions);
      const elapsedMs = Math.round(performance.now() - startedAt);
      const contentType = response.headers.get("content-type") || "";
      let parsedResponseBody;

      if (contentType.includes("application/json")) {
        parsedResponseBody = await response.json();
      } else {
        parsedResponseBody = await response.text();
      }

      setResponseData({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        elapsedMs,
        headers: buildHeadersObject(response.headers),
        body: parsedResponseBody,
      });
    } catch (error) {
      setErrorMessage(error?.message || "No se pudo completar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const buildExportObject = () => ({
    url: url || "",
    method,
    body: body || "",
    tokenSource,
    customToken: customToken || "",
  });

  const handleExportConfig = () => {
    const data = buildExportObject();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "api-test-config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  const applyImportedConfig = (data) => {
    if (data.url !== undefined) setUrl(String(data.url));
    if (data.method) setMethod(String(data.method));
    if (data.body !== undefined) setBody(String(data.body));
    if (data.tokenSource) setTokenSource(String(data.tokenSource));
    if (data.customToken !== undefined) setCustomToken(String(data.customToken));
  };

  const importFromText = (text) => {
    setImportError("");
    try {
      const parsed = JSON.parse(text);
      // basic validation: must be object
      if (typeof parsed !== "object" || parsed === null) {
        setImportError("El JSON debe ser un objeto con la configuración.");
        return;
      }
      applyImportedConfig(parsed);
      setImportText("");
    } catch (err) {
      setImportError("JSON inválido: " + err.message);
    }
  };

  const handleImportFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      importFromText(String(reader.result));
      // clear file input to allow re-upload same file if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => setImportError("No se pudo leer el archivo.");
    reader.readAsText(file);
  };

  const handleCopyConfigToClipboard = async () => {
    setImportError("");
    try {
      const dataStr = JSON.stringify(buildExportObject(), null, 2);
      await navigator.clipboard.writeText(dataStr);
    } catch (err) {
      setImportError("No se pudo copiar al portapapeles: " + (err?.message || err));
    }
  };

  const handlePasteFromClipboard = async () => {
    setImportError("");
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setImportError("El portapapeles está vacío.");
        return;
      }
      importFromText(text);
    } catch (err) {
      setImportError("No se pudo leer el portapapeles: " + (err?.message || err));
    }
  };

  return (
    <DashboardLayout>
      <CustomContainer className="py-6">
        <SectionIntro
          title="API Test"
          subtitle="Prueba endpoints manualmente: URL, metodo HTTP, body y token bearer."
          eyebrow={<Breadcrumbs />}
          smaller
          className="pb-8 md:pb-10 mb-6 md:mb-8 pt-6"
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-bordercolor bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-black">Configurar solicitud</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://api.tu-dominio.com/recurso"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-accent_color"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Metodo HTTP</label>
                <select
                  value={method}
                  onChange={(event) => setMethod(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-accent_color"
                >
                  {HTTP_METHODS.map((httpMethod) => (
                    <option key={httpMethod} value={httpMethod}>
                      {httpMethod}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Bearer token</label>
                <select
                  value={tokenSource}
                  onChange={(event) => setTokenSource(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-accent_color"
                >
                  <option value={TOKEN_SOURCES.NONE}>No enviar token</option>
                  <option value={TOKEN_SOURCES.LOCAL_STORAGE}>Usar token de localStorage (token)</option>
                  <option value={TOKEN_SOURCES.CUSTOM}>Usar token personalizado</option>
                </select>
              </div>

              {tokenSource === TOKEN_SOURCES.CUSTOM && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Token personalizado</label>
                  <input
                    type="text"
                    value={customToken}
                    onChange={(event) => setCustomToken(event.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-accent_color"
                  />
                </div>
              )}

              {showBodyInput && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Body (JSON)</label>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={10}
                    placeholder='{"name": "ejemplo"}'
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none transition focus:border-accent_color"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* <button
                      type="button"
                      onClick={handleExportConfig}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:brightness-95"
                    >
                      Exportar archivo
                    </button> */}

                    <button
                      type="button"
                      onClick={handleCopyConfigToClipboard}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:brightness-95"
                    >
                      Copiar al portapapeles
                    </button>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:brightness-95"
                    >
                      Importar desde archivo
                    </button> */}

                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:brightness-95"
                    >
                      Pegar desde portapapeles
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json"
                      onChange={handleImportFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  {/* <label className="text-sm font-semibold text-gray-700">Pegar JSON para importar</label>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={4}
                    placeholder='Paste here the exported JSON and click "Importar JSON"'
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none transition focus:border-accent_color"
                  /> */}
                  {/* <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => importFromText(importText)}
                      className="rounded-lg bg-accent_color px-4 py-2 font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                      disabled={!importText}
                    >
                      Importar JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => { setImportText(""); setImportError(""); }}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-black transition hover:brightness-95"
                    >
                      Limpiar
                    </button>
                  </div> */}
                  {importError && (
                    <p className="mt-2 text-sm text-red-700">{importError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-accent_color px-4 py-2 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-bordercolor bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-black">Respuesta API</h3>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {!errorMessage && !responseData && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
                Aqui veras el status, headers y body de la respuesta.
              </div>
            )}

            {responseData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <p className="text-xs uppercase text-gray-500">Status</p>
                    <p className={`text-lg font-bold ${responseData.ok ? "text-green-700" : "text-red-700"}`}>
                      {responseData.status} {responseData.statusText}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-3">
                    <p className="text-xs uppercase text-gray-500">Tiempo</p>
                    <p className="text-lg font-bold text-black">{responseData.elapsedMs} ms</p>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-3">
                    <p className="text-xs uppercase text-gray-500">Resultado</p>
                    <p className={`text-lg font-bold ${responseData.ok ? "text-green-700" : "text-red-700"}`}>
                      {responseData.ok ? "OK" : "ERROR"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">Headers</h4>
                  <pre className="max-h-56 overflow-auto rounded-lg bg-black p-3 text-xs text-white">
                    {JSON.stringify(responseData.headers, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">Body</h4>
                  <pre className="max-h-72 overflow-auto rounded-lg bg-black p-3 text-xs text-white">
                    {typeof responseData.body === "string"
                      ? responseData.body
                      : JSON.stringify(responseData.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </section>
        </div>
      </CustomContainer>
    </DashboardLayout>
  );
}
