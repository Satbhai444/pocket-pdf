"use client";

import { useState, useRef, useEffect } from "react";
import { FileDown, FilePlus, Play, CheckCircle2, Loader2, X, GripVertical } from "lucide-react";
import { PDFDocument, degrees, rgb, BlendMode } from "pdf-lib";
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';
import { useLanguage } from "@/context/LanguageContext";
import SignatureCanvas from 'react-signature-canvas';
import { Reorder } from "framer-motion";

export default function GadgetWorkspace({ selectedGadget, onClose }: { selectedGadget: any, onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gadgetOptions, setGadgetOptions] = useState<Record<string, any>>({});
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Set up PDF.js worker dynamically to avoid SSR issues
    import('pdfjs-dist').then(pdfjsLib => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    });
  }, []);

  const generateThumbnail = async (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    } else if (file.type === 'application/pdf') {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 }); // scale down for thumbnail
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport }).promise;
        return canvas.toDataURL();
      } catch (e) {
        console.error("Thumbnail generation error:", e);
        return null;
      }
    }
    return null;
  };

  const playSfx = (type: 'success' | 'error' | 'pop') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
      } else if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'pop') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.05);
      }
    } catch (e) {
      // Ignore if audio fails
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      playSfx('pop');
      setFiles((prev) => [...prev, ...acceptedFiles]);
      
      // Generate thumbnails
      for (const file of acceptedFiles) {
        const thumb = await generateThumbnail(file);
        if (thumb) {
          setThumbnails(prev => ({ ...prev, [file.name]: thumb }));
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: selectedGadget.category === "PDF" 
      ? { 'application/pdf': ['.pdf'] } 
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setIsSuccess(false);

    try {
      if (selectedGadget.id === "super-glue") {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const mergedPdfBytes = await mergedPdf.save();
        downloadFile(mergedPdfBytes, "Merged_By_Doraemon.pdf", "application/pdf");
      } 
      else if (selectedGadget.id === "small-light") {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        pdf.setTitle("");
        pdf.setAuthor("");
        const compressedBytes = await pdf.save({ useObjectStreams: false });
        downloadFile(compressedBytes, "Compressed_By_Small_Light.pdf", "application/pdf");
      }
      else if (selectedGadget.id === "pass-loop") {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const newPdf = await PDFDocument.create();
        const pageCount = pdf.getPageCount();
        
        let pagesToKeep: number[] = [];
        const rangeStr = gadgetOptions.pageRange || "1-" + pageCount;
        
        rangeStr.split(',').forEach((part: string) => {
          const range = part.trim().split('-');
          if (range.length === 1) {
            const p = parseInt(range[0]);
            if (!isNaN(p) && p >= 1 && p <= pageCount) pagesToKeep.push(p - 1);
          } else if (range.length === 2) {
            let start = parseInt(range[0]);
            let end = parseInt(range[1]);
            if (!isNaN(start) && !isNaN(end)) {
              start = Math.max(1, start);
              end = Math.min(pageCount, end);
              for (let i = start; i <= end; i++) pagesToKeep.push(i - 1);
            }
          }
        });
        
        if (pagesToKeep.length === 0) {
          throw new Error("Invalid page range");
        }
        
        const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
        copiedPages.forEach((page) => newPdf.addPage(page));
        const savedBytes = await newPdf.save();
        downloadFile(savedBytes, "Extracted_By_Pass_Loop.pdf", "application/pdf");
      }
      else if (selectedGadget.id === "time-furoshiki") {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        if (gadgetOptions.removeMetadata !== false) {
          pdf.setTitle("");
          pdf.setAuthor("");
          pdf.setSubject("");
          pdf.setKeywords([]);
          pdf.setProducer("");
          pdf.setCreator("");
        }
        
        // Note: Flattening annotations requires more complex pdf-lib operations,
        // but we can at least remove metadata easily. 
        const savedBytes = await pdf.save();
        downloadFile(savedBytes, "Cleaned_By_Time_Furoshiki.pdf", "application/pdf");
      }
      else if (selectedGadget.id === "stamp") {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = pdf.getPages();
        const text = gadgetOptions.watermarkText || "CONFIDENTIAL";
        const pos = gadgetOptions.stampPos || "center";
        
        pages.forEach(page => {
          const { width, height } = page.getSize();
          const fontSize = 50;
          let x = width / 2 - (text.length * fontSize) / 4;
          let y = height / 2;
          let rotate = degrees(0);
          
          if (pos === "diagonal") {
            rotate = degrees(45);
            x = width / 4;
            y = height / 4;
          } else if (pos === "bottom") {
            y = 50;
          }
          
          page.drawText(text, {
            x,
            y,
            size: fontSize,
            opacity: 0.25,
            color: rgb(0.5, 0.5, 0.5),
            blendMode: BlendMode.Multiply,
            rotate
          });
        });
        
        const savedBytes = await pdf.save();
        downloadFile(savedBytes, "Stamped.pdf", "application/pdf");
      }
      else if (selectedGadget.id === "air-crayon" && sigCanvasRef.current) {
        // Just save the drawn canvas as a transparent PNG for now
        const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
        
        // Convert base64 to Blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AirCrayon_Drawing.png";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      else if (selectedGadget.id === "designer-furoshiki" && files[0]) {
        const file = files[0];
        const format = gadgetOptions.targetFormat || "image/jpeg";
        const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
        
        // Draw to canvas and export
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(r => img.onload = r);
        
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL(format, 0.9);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Converted.${ext}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      else {
        await new Promise((res) => setTimeout(res, 2000));
        toast.error(t("Not fully implemented client-side yet!"));
      }
      
      setIsProcessing(false);
      setIsSuccess(true);
      playSfx('success');
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-doraemon-blue">{t("mangaSuccess")}</span>
          <span className="text-sm font-sans">{selectedGadget.name} {t("successMsg")}</span>
        </div>
      );
      
      try {
        const history = JSON.parse(localStorage.getItem("4d-history") || "[]");
        const newEntry = { name: files[0].name, gadget: selectedGadget.name, time: new Date().toISOString() };
        localStorage.setItem("4d-history", JSON.stringify([newEntry, ...history].slice(0, 10)));
      } catch (e) {}

      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      playSfx('error');
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-doraemon-red">Error! 🚨</span>
          <span className="text-sm font-sans">{t("errorMsg")}</span>
        </div>
      );
      setIsProcessing(false);
    }
  };

  const downloadFile = (bytes: Uint8Array, filename: string, type: string) => {
    const blob = new Blob([bytes], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-[2rem] manga-border manga-shadow-lg">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-[3px] border-black gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className={`${selectedGadget.color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl manga-border shrink-0 ${selectedGadget.color.includes('text-black') ? 'text-black' : 'text-white'}`}>
            {selectedGadget.icon}
          </div>
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-bangers)] text-xl sm:text-3xl md:text-4xl tracking-widest text-doraemon-blue truncate">
              {selectedGadget.name}
            </h2>
            <p className="text-[10px] sm:text-sm font-bold text-gray-500 uppercase mt-0.5 sm:mt-1">
              {selectedGadget.japanese} • {selectedGadget.category}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="bg-gray-200 hover:bg-doraemon-red hover:text-white font-bold p-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl manga-border transition-colors shrink-0"
        >
          <span className="hidden sm:inline">Close</span> ✕
        </button>
      </div>
      
      <p className="text-gray-700 font-bold mb-4 sm:mb-8 text-xs sm:text-base md:text-lg max-w-3xl leading-relaxed italic">
        &quot;{selectedGadget.description}&quot;
      </p>
      
      {/* Drag & Drop Zone */}
      <div 
        {...getRootProps()}
        className={`border-[3px] sm:border-[4px] border-dashed rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 flex flex-col items-center justify-center transition-colors cursor-pointer relative group overflow-hidden ${
          isDragActive ? "border-doraemon-red bg-red-50" : "border-doraemon-blue bg-blue-50/50 hover:bg-blue-100"
        }`}
      >
        <input {...getInputProps()} />
        
        {isDragActive ? (
           <FilePlus size={40} className="sm:w-16 sm:h-16 text-doraemon-red mb-3 sm:mb-4 animate-bounce relative z-10" />
        ) : (
           <FileDown size={40} className="sm:w-16 sm:h-16 text-doraemon-blue mb-3 sm:mb-4 group-hover:-translate-y-2 transition-transform duration-300 relative z-10" />
        )}
        
        <h3 className="font-[family-name:var(--font-bangers)] text-lg sm:text-2xl text-gray-800 tracking-wide relative z-10 text-center">
          {isDragActive ? t("dropIt") : (selectedGadget.category === "PDF" ? t("dropPdf") : t("dropImage"))}
        </h3>
        <p className="text-gray-600 font-bold mt-2 sm:mt-3 text-xs sm:text-sm relative z-10">
          {t("tapToBrowse")}
        </p>
      </div>

      {/* Selected Files List with Previews */}
      {files.length > 0 && (
        <Reorder.Group axis="y" values={files} onReorder={setFiles} className="mt-4 sm:mt-6 flex flex-col gap-3 bg-gray-50 p-3 sm:p-5 rounded-xl sm:rounded-2xl manga-border">
          <h4 className="font-[family-name:var(--font-bangers)] tracking-widest text-base sm:text-lg text-doraemon-blue uppercase mb-1 sm:mb-2 border-b-2 border-gray-200 pb-2 flex items-center justify-between">
            {t("filesToProcess")}
            {selectedGadget.id === "super-glue" && <span className="text-xs text-doraemon-red">(Drag to reorder!)</span>}
          </h4>
          {files.map((file, idx) => (
            <Reorder.Item key={file.name + file.size} value={file} className="flex justify-between items-center bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border-[3px] border-black gap-3 manga-shadow-sm group cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" size={20} />
                <div className="w-12 h-16 sm:w-16 sm:h-20 bg-gray-100 rounded-md border-2 border-black overflow-hidden flex items-center justify-center shrink-0 pointer-events-none">
                  {thumbnails[file.name] ? (
                    <img src={thumbnails[file.name]} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 pointer-events-none">
                  <span className="font-[family-name:var(--font-bangers)] text-base sm:text-lg truncate tracking-wider">{file.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    {selectedGadget.id === "small-light" && (
                      <span className="font-bold text-[10px] sm:text-xs text-green-600">
                        ~ {(file.size / 1024 / 1024 * (gadgetOptions.compressionLevel === "3" ? 0.3 : gadgetOptions.compressionLevel === "2" ? 0.6 : 0.8)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFile(idx); }} className="bg-red-100 p-2 rounded-lg border-2 border-transparent group-hover:border-red-500 text-red-500 hover:text-white hover:bg-red-500 shrink-0 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Gadget Specific Options */}
      {files.length > 0 && (
        <div className="mt-4 sm:mt-6 w-full">
          
          {selectedGadget.id === "small-light" && (
            <div className="p-4 sm:p-6 bg-blue-50 rounded-xl sm:rounded-2xl border-2 border-doraemon-blue manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-doraemon-blue uppercase mb-2 tracking-widest">Compression Power</h4>
              <input 
                type="range" 
                min="1" max="3" 
                value={gadgetOptions.compressionLevel || "2"} 
                onChange={(e) => setGadgetOptions({...gadgetOptions, compressionLevel: e.target.value})}
                className="w-full cursor-pointer accent-doraemon-blue h-2 sm:h-3 bg-white rounded-full appearance-none border-2 border-black" 
              />
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-500 mt-2 uppercase tracking-wider">
                <span>Low</span><span>Medium</span><span>Extreme</span>
              </div>
            </div>
          )}

          {selectedGadget.id === "super-glue" && (
            <div className="p-4 sm:p-6 bg-red-50 rounded-xl sm:rounded-2xl border-2 border-doraemon-red manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-doraemon-red uppercase mb-2 tracking-widest">Merge Sequence</h4>
              <p className="font-bold text-xs sm:text-sm">PDFs will be merged in order listed above.</p>
            </div>
          )}

          {selectedGadget.id === "pass-loop" && (
            <div className="p-4 sm:p-6 bg-yellow-50 rounded-xl sm:rounded-2xl border-2 border-doraemon-yellow manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-black uppercase mb-2 tracking-widest">Page Range</h4>
              <input 
                type="text" 
                placeholder="e.g., 1-5, 8, 11-13" 
                value={gadgetOptions.pageRange || ""}
                onChange={(e) => setGadgetOptions({...gadgetOptions, pageRange: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-yellow-200" 
              />
            </div>
          )}

          {selectedGadget.id === "time-furoshiki" && (
            <div className="p-4 sm:p-6 bg-purple-50 rounded-xl sm:rounded-2xl border-2 border-purple-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-purple-600 uppercase mb-2 tracking-widest">Cleaning Options</h4>
              <label className="flex items-center gap-2 font-bold cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={gadgetOptions.removeMetadata !== false} 
                  onChange={(e) => setGadgetOptions({...gadgetOptions, removeMetadata: e.target.checked})}
                  className="w-4 sm:w-5 h-4 sm:h-5 accent-purple-600" 
                /> Remove Metadata
              </label>
              <label className="flex items-center gap-2 font-bold mt-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={gadgetOptions.flattenAnnotations !== false} 
                  onChange={(e) => setGadgetOptions({...gadgetOptions, flattenAnnotations: e.target.checked})}
                  className="w-4 sm:w-5 h-4 sm:h-5 accent-purple-600" 
                /> Flatten Annotations
              </label>
            </div>
          )}

          {selectedGadget.id === "air-crayon" && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full">
            <label className="font-bold text-gray-700 whitespace-nowrap text-sm sm:text-base">Crayon Color:</label>
            <input 
              type="color" 
              className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer p-0 border-2 border-black rounded-lg"
              value={gadgetOptions.crayonColor || "#ff0000"} 
              onChange={e => setGadgetOptions({...gadgetOptions, crayonColor: e.target.value})} 
            />
          </div>
        )}

        {selectedGadget.id === "dokodemo-door" && (
            <div className="p-4 sm:p-6 bg-pink-50 rounded-xl sm:rounded-2xl border-2 border-pink-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-pink-600 uppercase mb-2 tracking-widest">Target Format</h4>
              <select 
                value={gadgetOptions.targetFormat || "docx"}
                onChange={(e) => setGadgetOptions({...gadgetOptions, targetFormat: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-pink-200"
              >
                <option value="docx">Word (.docx)</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="txt">Plain Text (.txt)</option>
              </select>
            </div>
          )}

          {selectedGadget.id === "memory-bread" && (
            <div className="p-4 sm:p-6 bg-orange-50 rounded-xl sm:rounded-2xl border-2 border-orange-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-orange-600 uppercase mb-2 tracking-widest">OCR Language</h4>
              <select 
                value={gadgetOptions.ocrLanguage || "eng"}
                onChange={(e) => setGadgetOptions({...gadgetOptions, ocrLanguage: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="jpn">Japanese</option>
              </select>
            </div>
          )}
          
          {selectedGadget.id === "secret-lock" && (
            <div className="p-4 sm:p-6 bg-slate-100 rounded-xl sm:rounded-2xl border-2 border-slate-700 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-slate-700 uppercase mb-2 tracking-widest">Set Password</h4>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={gadgetOptions.password || ""}
                onChange={(e) => setGadgetOptions({...gadgetOptions, password: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-slate-300" 
              />
            </div>
          )}

          {selectedGadget.id === "unlock-key" && (
            <div className="p-4 sm:p-6 bg-green-50 rounded-xl sm:rounded-2xl border-2 border-green-600 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-green-700 uppercase mb-2 tracking-widest">Original Password</h4>
              <input 
                type="password" 
                placeholder="Enter current password" 
                value={gadgetOptions.originalPassword || ""}
                onChange={(e) => setGadgetOptions({...gadgetOptions, originalPassword: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-green-300" 
              />
            </div>
          )}

          {selectedGadget.id === "stamp" && (
            <div className="p-4 sm:p-6 bg-red-50 rounded-xl sm:rounded-2xl border-2 border-red-600 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-red-600 uppercase mb-2 tracking-widest">Watermark Text</h4>
              <input 
                type="text" 
                placeholder="e.g. CONFIDENTIAL" 
                value={gadgetOptions.watermarkText || ""}
                onChange={(e) => setGadgetOptions({...gadgetOptions, watermarkText: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-red-200" 
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer text-xs sm:text-sm">
                  <input type="radio" name="stamp-pos" checked={!gadgetOptions.stampPos || gadgetOptions.stampPos === "center"} onChange={() => setGadgetOptions({...gadgetOptions, stampPos: "center"})} className="accent-red-600" /> Center
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer text-xs sm:text-sm">
                  <input type="radio" name="stamp-pos" checked={gadgetOptions.stampPos === "diagonal"} onChange={() => setGadgetOptions({...gadgetOptions, stampPos: "diagonal"})} className="accent-red-600" /> Diagonal
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer text-xs sm:text-sm">
                  <input type="radio" name="stamp-pos" checked={gadgetOptions.stampPos === "bottom"} onChange={() => setGadgetOptions({...gadgetOptions, stampPos: "bottom"})} className="accent-red-600" /> Bottom
                </label>
              </div>
            </div>
          )}

          {selectedGadget.id === "translation-konjac" && (
            <div className="p-4 sm:p-6 bg-teal-50 rounded-xl sm:rounded-2xl border-2 border-teal-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-teal-700 uppercase mb-2 tracking-widest">Translate To</h4>
              <select 
                value={gadgetOptions.translateTo || "hi"}
                onChange={(e) => setGadgetOptions({...gadgetOptions, translateTo: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="ja">Japanese</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          )}

          {selectedGadget.id === "big-light" && (
            <div className="p-4 sm:p-6 bg-blue-100 rounded-xl sm:rounded-2xl border-2 border-blue-400 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-blue-800 uppercase mb-2 tracking-widest">Upscale Factor</h4>
              <select 
                value={gadgetOptions.upscaleFactor || "2"}
                onChange={(e) => setGadgetOptions({...gadgetOptions, upscaleFactor: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <option value="2">2x (Double)</option>
                <option value="4">4x (Quadruple)</option>
                <option value="8">8x (Extreme HD)</option>
              </select>
            </div>
          )}

          {selectedGadget.id === "dress-up-cam" && (
            <div className="p-4 sm:p-6 bg-rose-50 rounded-xl sm:rounded-2xl border-2 border-rose-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-rose-600 uppercase mb-2 tracking-widest">AI Tolerance</h4>
              <input 
                type="range" 
                min="1" max="100" 
                value={gadgetOptions.aiTolerance || "50"}
                onChange={(e) => setGadgetOptions({...gadgetOptions, aiTolerance: e.target.value})}
                className="w-full cursor-pointer accent-rose-500 h-2 sm:h-3 bg-white rounded-full appearance-none border-2 border-black" 
              />
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-500 mt-2">
                <span>Strict</span><span>Balanced</span><span>Loose</span>
              </div>
            </div>
          )}

          {selectedGadget.id === "designer-furoshiki" && (
            <div className="p-4 sm:p-6 bg-indigo-50 rounded-xl sm:rounded-2xl border-2 border-indigo-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-indigo-700 uppercase mb-2 tracking-widest">Convert To</h4>
              <select 
                value={gadgetOptions.convertTo || "png"}
                onChange={(e) => setGadgetOptions({...gadgetOptions, convertTo: e.target.value})}
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-black font-bold text-sm focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <option value="png">PNG (Transparent)</option>
                <option value="jpg">JPG (Smaller)</option>
                <option value="webp">WEBP (Web)</option>
              </select>
              <div className="mt-3">
                <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-indigo-700 uppercase mb-2 tracking-widest">Quality</h4>
                <input 
                  type="range" 
                  min="10" max="100" 
                  value={gadgetOptions.quality || "85"}
                  onChange={(e) => setGadgetOptions({...gadgetOptions, quality: e.target.value})}
                  className="w-full cursor-pointer accent-indigo-500 h-2 sm:h-3 bg-white rounded-full appearance-none border-2 border-black" 
                />
                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-500 mt-1">
                  <span>10%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            </div>
          )}

          {selectedGadget.id === "restoring-beam" && (
            <div className="p-4 sm:p-6 bg-amber-50 rounded-xl sm:rounded-2xl border-2 border-amber-400 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-amber-700 uppercase mb-2 tracking-widest">Enhancement</h4>
              <label className="flex items-center gap-2 font-bold cursor-pointer text-sm">
                <input type="checkbox" checked={gadgetOptions.denoise !== false} onChange={(e) => setGadgetOptions({...gadgetOptions, denoise: e.target.checked})} className="w-4 sm:w-5 h-4 sm:h-5 accent-amber-500" /> Denoise
              </label>
              <label className="flex items-center gap-2 font-bold mt-2 cursor-pointer text-sm">
                <input type="checkbox" checked={gadgetOptions.sharpen !== false} onChange={(e) => setGadgetOptions({...gadgetOptions, sharpen: e.target.checked})} className="w-4 sm:w-5 h-4 sm:h-5 accent-amber-500" /> Sharpen
              </label>
              <label className="flex items-center gap-2 font-bold mt-2 cursor-pointer text-sm">
                <input type="checkbox" checked={gadgetOptions.autoColorCorrect === true} onChange={(e) => setGadgetOptions({...gadgetOptions, autoColorCorrect: e.target.checked})} className="w-4 sm:w-5 h-4 sm:h-5 accent-amber-500" /> Auto Color Correct
              </label>
            </div>
          )}

          {selectedGadget.id === "air-crayon" && (
            <div className="p-4 sm:p-6 bg-lime-50 rounded-xl sm:rounded-2xl border-2 border-lime-500 manga-shadow-sm">
              <h4 className="font-[family-name:var(--font-bangers)] text-base sm:text-xl text-lime-700 uppercase mb-2 tracking-widest">Drawing Tools</h4>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase block mb-1">Color</span>
                  <input 
                    type="color" 
                    value={gadgetOptions.drawColor || "#ff0000"} 
                    onChange={(e) => setGadgetOptions({...gadgetOptions, drawColor: e.target.value})}
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded cursor-pointer border-2 border-black p-0" 
                  />
                </div>
                <div className="flex-grow min-w-[120px]">
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase block mb-1">Brush Size</span>
                  <input 
                    type="range" 
                    min="1" max="20" 
                    value={gadgetOptions.brushSize || "5"}
                    onChange={(e) => setGadgetOptions({...gadgetOptions, brushSize: e.target.value})}
                    className="w-full cursor-pointer accent-lime-500 h-2 sm:h-3 bg-white rounded-full appearance-none border-2 border-black" 
                  />
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button onClick={() => setGadgetOptions({...gadgetOptions, activeTool: "pen"})} className={`${!gadgetOptions.activeTool || gadgetOptions.activeTool === "pen" ? "bg-lime-300" : "bg-lime-100"} font-bold text-xs px-3 py-2 rounded-lg border-2 border-black hover:bg-lime-300 transition-colors`}>Pen</button>
                  <button onClick={() => setGadgetOptions({...gadgetOptions, activeTool: "eraser"})} className={`${gadgetOptions.activeTool === "eraser" ? "bg-lime-300" : "bg-white"} font-bold text-xs px-3 py-2 rounded-lg border-2 border-black hover:bg-gray-100 transition-colors`}>Eraser</button>
                  <button onClick={() => setGadgetOptions({...gadgetOptions, activeTool: "text"})} className={`${gadgetOptions.activeTool === "text" ? "bg-lime-300" : "bg-white"} font-bold text-xs px-3 py-2 rounded-lg border-2 border-black hover:bg-gray-100 transition-colors`}>Text</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Canvas for Air Crayon */}
      {selectedGadget.id === "air-crayon" && files.length > 0 && thumbnails[files[0].name] && (
        <div className="mt-6 flex flex-col gap-2">
          <h4 className="font-[family-name:var(--font-bangers)] tracking-widest text-base sm:text-lg text-doraemon-blue uppercase mb-1">Canvas Editor</h4>
          <div 
            className="w-full relative border-[3px] border-black rounded-xl overflow-hidden bg-white manga-shadow-sm cursor-crosshair" 
            style={{ 
              backgroundImage: `url(${thumbnails[files[0].name]})`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'center', 
              height: '50vh',
              minHeight: '300px'
            }}
          >
            <SignatureCanvas 
              ref={sigCanvasRef} 
              penColor={gadgetOptions.crayonColor || '#ff0000'} 
              canvasProps={{className: 'w-full h-full absolute inset-0'}} 
            />
          </div>
          <button 
            onClick={() => sigCanvasRef.current?.clear()} 
            className="self-end mt-2 text-sm font-bold text-red-500 hover:underline"
          >
            Clear Drawing
          </button>
        </div>
      )}

      {/* Action Button */}
      {files.length > 0 && (
        <div className="mt-6 sm:mt-8 flex flex-col items-center">
          <button 
            onClick={processPDF}
            disabled={isProcessing}
            className={`
              ${isProcessing ? 'bg-gray-400' : isSuccess ? 'bg-green-500' : selectedGadget.color} 
              ${(!isProcessing && !isSuccess && selectedGadget.color.includes('text-black')) ? 'text-black' : 'text-white'}
              font-[family-name:var(--font-bangers)] text-lg sm:text-2xl px-8 sm:px-12 py-3 sm:py-4 rounded-xl 
              manga-border manga-shadow hover:-translate-y-1 hover:manga-shadow-lg transition-all tracking-widest
              flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center
            `}
          >
            {isProcessing && <Loader2 className="animate-spin" size={22} />}
            {!isProcessing && !isSuccess && <Play size={22} />}
            {isSuccess && <CheckCircle2 size={22} />}
            
            {isProcessing ? "PROCESSING..." : isSuccess ? "MAGIC DONE! 🎉" : "USE GADGET NOW! 🚀"}
          </button>
          
          {isSuccess && (
            <div className="mt-3 sm:mt-4 font-bold text-green-600 bg-green-50 px-3 sm:px-4 py-2 rounded-full border-2 border-green-200 animate-bounce text-xs sm:text-sm text-center">
              ✓ File Downloaded! Check downloads folder.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
