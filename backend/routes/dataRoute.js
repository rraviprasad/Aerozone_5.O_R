const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const { db } = require("./../config/firebase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Helpers
const parseDate = (dateValue) => {
  if (!dateValue) return null;
  if (typeof dateValue === "number") return new Date((dateValue - 25569) * 86400 * 1000);
  if (typeof dateValue === "string") return new Date(dateValue);
  if (dateValue instanceof Date) return dateValue;
  return null;
};

const formatDateToDDMMMYYYY = (date) => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


const calculateInventoryValue = (orderLineValue, orderedQty, onHand) => {
  orderLineValue = Number(orderLineValue) || 0;
  orderedQty = Number(orderedQty) || 0;
  onHand = Number(onHand) || 0;
  return orderedQty > 0 ? ((orderLineValue / orderedQty) * onHand).toFixed(2) : 0;
};

router.post("/upload-excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    // 1️⃣ CLEAR OLD DATA FIRST (Batch deletion for reliability)
    console.log("Starting to clear old excelData...");
    const snapshot = await db.collection("excelData").get();
    
    if (!snapshot.empty) {
      let deleteBatch = db.batch();
      let deleteCount = 0;
      
      for (const doc of snapshot.docs) {
        deleteBatch.delete(doc.ref);
        deleteCount++;
        
        if (deleteCount === 500) {
          await deleteBatch.commit();
          deleteBatch = db.batch();
          deleteCount = 0;
        }
      }
      if (deleteCount > 0) await deleteBatch.commit();
      console.log(`Cleared ${snapshot.size} records.`);
    }

    // 2️⃣ PROCESS NEW EXCEL
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headerRow = data[0] || [];
    const headers = {};
    headerRow.forEach((header, index) => {
      if (header) headers[String(header).trim()] = index;
    });

    const getValue = (row, key) => {
      const index = headers[key];
      return index !== undefined ? String(row[index] || "").trim() : "";
    };

    const rows = data.slice(1);

    console.log(`Processing ${rows.length} new records...`);
    let batch = db.batch();
    let count = 0;
    let savedCount = 0;

    for (const row of rows) {
      if (!row || row.length === 0) continue; 

      const rawRef = getValue(row, "Ref B") || "N/A";
      const projectCode = getValue(row, "Project");
      const itemCode = getValue(row, "Item");
      
      const typeCol = getValue(row, "Type");
      const materialValue = getValue(row, "Material");
      const typeMaterialValue = getValue(row, "typeMaterial");
      const computedType = typeCol || `${materialValue}${typeMaterialValue}`;

      // ✅ Generate UniqueCode for matching (RefB number + Project + Item)
      const refNum = (rawRef.match(/\d+/) || ["N/A"])[0];
      const uniqueCode = `${refNum}${projectCode}${itemCode}`;

      const rowData = {
        UniqueCode: uniqueCode,
        ReferenceB: rawRef, 
        ProjectCode: projectCode,
        ItemCode: itemCode,
        ItemShortDescription: getValue(row, "Item Short Description"),
        Description: getValue(row, "Item Short Description"), // backward compatibility
        ItemLongDescription: getValue(row, "Item Long Description"),
        SupplierName: getValue(row, "Supplier Name"),
        Supplier: getValue(row, "Supplier Name"), // backward compatibility
        SupplierCode: getValue(row, "Supplier Code"),
        Category: getValue(row, "Category"),
        PONo: getValue(row, "Purchase Order Number"),
        PO_No: getValue(row, "Purchase Order Number"), // backward compatibility
        PurchaseOrderPosition: getValue(row, "Purchase Order Position"),
        OrderedLineQuantity: parseFloat(getValue(row, "Ordered Line Quantity")) || 0,
        OrderedQty: parseFloat(getValue(row, "Ordered Line Quantity")) || 0, // backward compatibility
        TotalPOLineDeliveredQuantity: parseFloat(getValue(row, "Total PO Line Delivered Quantity")) || 0,
        PendingQuantityForSequence: parseFloat(getValue(row, "Pending Quantity for Sequence")) || 0,
        PricePerUnit: parseFloat(getValue(row, "Price per Unit")) || 0,
        OrderLineValue: parseFloat(getValue(row, "Order Line Value")) || 0,
        PendingValueForLineSequence: parseFloat(getValue(row, "Pending Value for Line Sequence")) || 0,
        OrderLineValueINR: parseFloat(getValue(row, "Order Line Value(INR)")) || 0,
        PendingValueForLineSequenceINR: parseFloat(getValue(row, "Pending Value for Line Sequence(INR)")) || 0,
        LineSequenceAgingInDays: getValue(row, "Line Sequence Aging in Days"),
        PurchaseOrderLineStatus: getValue(row, "Purchase Order Line Status"),
        PurchaseOrderLineAggregateTaxCode: getValue(row, "Purchase Order Line Aggregate Tax Code"),
        PlannedReceiptDate: getValue(row, "Planned Receipt Date"),
        Currency: getValue(row, "Currency"),
        ExchangeRate: parseFloat(getValue(row, "Exchange Rate")) || 0,
        PaymentTerms: getValue(row, "Payment Terms"),
        PaymentPeriod: getValue(row, "Payment Period"),
        MSMEIndicator: getValue(row, "MSME Indicator"),
        MSMEIndicatorValue: getValue(row, "MSME Indicator value"),
        MSMERegistrationDate: getValue(row, "MSME registration date"),
        PaymentMethod: getValue(row, "Payment Method"),
        GSTNNumberOfSupplier: getValue(row, "GSTN Number of Supplier"),
        TaxableValue: getValue(row, "Taxable Value"),
        HSNCode: getValue(row, "HSN Code"),
        StateOfSupplier: getValue(row, "State of Supplier"),
        StateOfReceiver: getValue(row, "State of Receiver"),
        InventoryQuantity: parseFloat(getValue(row, "On Hand")) || 0,
        CustomerName: getValue(row, "Customer Name") || getValue(row, "Customer"),
        Type: computedType,
        Material: materialValue,
        TypeMaterial: typeMaterialValue,
        LogisticCompany: getValue(row, "Logistic Company"),
        PurchaseOffice: getValue(row, "Purchase Office"),
        PendingSequence: getValue(row, "Pending Sequence"),
        BuyerCode: getValue(row, "Buyer Code"),
        BuyerName: getValue(row, "Buyer Name"),
        ItemGroup: getValue(row, "Item Group"),
        WarehouseCode: getValue(row, "Warehouse Code"),
        UOM: getValue(row, "Purchase UOM"),
        Date: getValue(row, "Order Date"),
        City: getValue(row, "City"),
        Country: getValue(row, "Country"),
        timestamp: new Date()
      };

      const docRef = db.collection("excelData").doc();
      batch.set(docRef, rowData);
      count++;
      savedCount++;

      // Committing in batches of 500 (Firestore limit)
      if (count === 500) {
        console.log(`Committing batch of 500...`);
        await batch.commit();
        batch = db.batch();
        count = 0;
      }
    }

    if (count > 0) {
      await batch.commit();
    }

    console.log(`Successfully saved ${savedCount} records.`);
    res.status(200).json({ message: "Data replaced successfully!", savedCount });
  } catch (error) {
    console.error("Critical Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ New route to fetch data
router.get("/get-data", async (req, res) => {
  try {
    // 1️⃣ Fetch excelData
    const excelSnap = await db.collection("excelData").get();
    const excelData = excelSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2️⃣ Fetch Indent_Quantity
    const indentSnap = await db.collection("Indent_Quantity").get();
    const indentData = indentSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3️⃣ Merge by ItemCode ↔ ITEM_CODE
    const mergedData = excelData.map((excelRow) => {
      const match = indentData.find(
        (indent) => indent.ITEM_CODE === excelRow.ItemCode
      );

      return {
        ...excelRow,
        IndentQuantity: match ? match.REQUIRED_QTY : "NA",
        IndentUOM: match ? match.UOM : "NA",
        IndentProject: match ? match.PROJECT_NO : "NA",
        IndentPlannedOrder: match ? match.PLANNED_ORDER : "NA",
      };
    });

    res.json(mergedData);
  } catch (err) {
    console.error("🔥 Error fetching merged data:", err);
    res.status(500).send("Error fetching data");
  }
});


// ✅ Fetch Indent_Quantity collection
router.get("/get-indent", async (req, res) => {
  try {
    const snapshot = await db.collection("Indent_Quantity").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching indent data");
  }
});

router.get("/prism", async (req, res) => {
  try {
    const excelSnap = await db.collection("excelData").get();
    const excelData = excelSnap.docs.map(doc => ({ ...doc.data() }));

    const indentSnap = await db.collection("Indent_Quantity").get();
    const indentData = indentSnap.docs.map(doc => ({ ...doc.data() }));

    // ---------- Group excelData ----------
    const excelGrouped = {};
    excelData.forEach(row => {
      const key = row.UniqueCode;
      if (!excelGrouped[key]) {
        excelGrouped[key] = {
          ProjectCode: row.ProjectCode || "",
          ItemCode: row.ItemCode || "",
          OrderedQty: Number(row.OrderedQty) || 0, // ✅ Correct field name
        };
      } else {
        excelGrouped[key].OrderedQty += Number(row.OrderedQty) || 0;
      }
    });

    // ---------- Group indentData ----------
    const indentGrouped = {};
    indentData.forEach(row => {
      const key = row.UNIQUE_CODE;
      if (!indentGrouped[key]) {
        indentGrouped[key] = {
          ReferenceB: row.ReferenceB || "",
          ProjectNo: row.PROJECT_NO || "",
          ItemCode: row.ITEM_CODE || "",
          Description: row.ITEM_DESCRIPTION || "",
          Category: row.CATEGORY || "",
          RequiredQty: Number(row.REQUIRED_QTY) || 0,
          UOM: row.UOM || "",
          PlannedOrder: row.PLANNED_ORDER || "",
          Type: row.TYPE || ""
        };
      } else {
        indentGrouped[key].RequiredQty += Number(row.REQUIRED_QTY) || 0;
      }
    });

    // ---------- LEFT JOIN (Indent primary) ----------
    const result = Object.keys(indentGrouped).map(key => {
      const indent = indentGrouped[key];
      const excel = excelGrouped[key] || {};
      const ordered = excel.OrderedQty || 0;

      return {
        UNIQUE_CODE: key,
        ReferenceB: indent.ReferenceB || "",
        ProjectNo: indent.ProjectNo || excel.ProjectCode || "",
        ItemCode: indent.ItemCode || excel.ItemCode || "",
        Description: indent.Description || excel.ItemShortDescription || excel.Description || "",
        Category: indent.Category || excel.Category || "",
        Type: indent.Type || excel.Type || "",
        Date: excel.Date || "",
        OrderedQty: ordered,
        RequiredQty: indent.RequiredQty || 0,
        Difference: (indent.RequiredQty || 0) - (ordered || 0),
        UOM: indent.UOM || excel.UOM || "",
        PlannedOrder: indent.PlannedOrder || excel.PONo || "",
        SupplierName: indent.SupplierName || excel.SupplierName || "",
        PONo: excel.PONo || ""
      };
    });

    res.json(result);
  } catch (err) {
    console.error("🔥 Error fetching merged data:", err);
    res.status(500).send("Error fetching data");
  }
});

router.get("/orbit", async (req, res) => {
  try {
    const excelSnap = await db.collection("excelData").get();

    const excelData = excelSnap.docs.map(doc => {
      const data = doc.data();

      return {
        ...data,
        ReferenceB:
          data.ReferenceB ??
          data["Reference B"] ??
          data.REFB ??
          data.REF_B ??
          data.Reference ??
          null,
        
      };
    });

    res.status(200).json(excelData);
  } catch (err) {
    console.error("🔥 Error fetching Orbit data:", err);
    res.status(500).send("Error fetching data");
  }
});


router.get("/analysis", async (req, res) => {
  try {
    const excelSnap = await db.collection("excelData").get();

    const excelData = excelSnap.docs.map(doc => {
      const data = doc.data();

      const orderValue = Number(data.OrderLineValue) || 0;   // ✅ FIXED
      const orderQty = Number(data.OrderedLineQuantity) || 0;

      const Rate = orderQty !== 0 ? ((orderValue / orderQty ).toFixed(3)): null;

      return {
        ...data,
        OrderLineValue: orderValue,           // ✅ use parsed number
        OrderedLineQuantity: orderQty,        // ✅ use parsed number
        Rate,                                 // ✅ calculated here
      };
    });

    res.status(200).json(excelData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  }
});

router.get("/analysistwo", async (req, res)=> {
  try{
    const excelSnap = await db.collection("excelData").get();

    const excelData = excelSnap.docs.map(doc => {
      const data = doc.data();

      return{
        ...data,
        ReferenceB:
          data.ReferenceB ??
          data["Reference B"] ??
          data.REFB ??
          data.REF_B ??
          data.Reference ??
          null,
      }
    });
res.status(200).json(excelData);
  } catch (err) {
    console.error("🔥 Error fetching Orbit data:", err);
    res.status(500).send("Error fetching data");
  }
});

module.exports = router;
