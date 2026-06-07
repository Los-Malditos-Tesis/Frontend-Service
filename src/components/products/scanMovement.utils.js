const GS1_PATTERNS = {
  PALLET: /^\(00\)([^()]+)\(01\)([^()]+)\(37\)([^()]+)\(30\)([^()]+)$/,
  BOX: /^\(01\)([^()]+)\(21\)([^()]+)\(30\)([^()]+)$/,
};

export const NUMBER_FORMATTER = new Intl.NumberFormat("es-SV");

export const normalizeScanType = (value) => {
  const type = String(value || "").toUpperCase();

  if (type === "ENT") return "ENT";
  if (type === "SLD" || type === "SAL") return "SLD";

  return "OTHER";
};

export const parseGs1Qr = (qrCode = "") => {
  const qrValue = String(qrCode).trim();

  if (!qrValue) {
    return {
      unitType: null,
      productCode: null,
      totalItems: null,
      palletCode: null,
      boxCode: null,
      boxesInPallet: null,
      itemsPerBox: null,
    };
  }

  const palletMatch = qrValue.match(GS1_PATTERNS.PALLET);

  if (palletMatch) {
    const [, palletCode, productCode, boxesInPallet, itemsPerBox] = palletMatch;

    return {
      unitType: "PALLET",
      productCode,
      totalItems: Number(boxesInPallet || 0) * Number(itemsPerBox || 0),
      palletCode,
      boxCode: null,
      boxesInPallet: Number(boxesInPallet || 0),
      itemsPerBox: Number(itemsPerBox || 0),
    };
  }

  const boxMatch = qrValue.match(GS1_PATTERNS.BOX);

  if (boxMatch) {
    const [, productCode, boxCode, items] = boxMatch;

    return {
      unitType: "BOX",
      productCode,
      totalItems: Number(items || 0),
      palletCode: null,
      boxCode,
      boxesInPallet: null,
      itemsPerBox: null,
    };
  }

  return {
    unitType: null,
    productCode: null,
    totalItems: null,
    palletCode: null,
    boxCode: null,
    boxesInPallet: null,
    itemsPerBox: null,
  };
};

export const getLocalDateKey = (dateValue) => {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatQuantity = (value) =>
  NUMBER_FORMATTER.format(Number(value || 0));

export const formatDateTime = (value) => {
  if (!value) return "--";

  return new Date(value).toLocaleString("es-SV", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateLabel = (value) => {
  if (!value) return "--";

  return new Date(value).toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getProductFilterValue = (product) =>
  product?.id || product?.code || product?.sku || "";