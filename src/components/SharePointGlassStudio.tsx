import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Image as ImageIcon,
  Layers,
  Maximize,
  Smartphone,
  Monitor,
  Square,
  Circle as CircleIcon,
  Minus,
  Wand2,
  Upload,
  Activity,
  Scaling,
} from 'lucide-react';

// --- Type Definitions ---
type ActiveSection = 'glass' | 'tools';
type Shape = 'rectangle' | 'circle' | 'pill';
type ActiveTab = 'controls' | 'sizes' | 'css';
type PreviewMode = 'desktop' | 'mobile';
type ResizeMode = 'scale' | 'manual';

interface GlassParams {
  shape: Shape;
  blur: number;
  opacity: number;
  saturation: number;
  color: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  borderOpacity: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOpacity: number;
  noiseOpacity: number;
  width: number;
  height: number;
}

interface ImageToolParams {
  scale: number;
  targetW: number;
  targetH: number;
  mode: ResizeMode;
  sharpen: boolean;
}

interface NavIconProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface SizePreset {
  name: string;
  w: number;
  h: number;
}

// --- Utility Functions ---
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Main Component ---
const SharePointGlassStudio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('glass');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col md:flex-row">
      {/* Main Sidebar Navigation */}
      <div className="w-full md:w-20 bg-gray-900 flex flex-col items-center py-6 gap-4 z-30 flex-shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
          <span className="text-white font-bold text-xl">S</span>
        </div>

        <NavIcon
          active={activeSection === 'glass'}
          onClick={() => setActiveSection('glass')}
          icon={<Layers size={24} />}
          label="Glass"
        />
        <NavIcon
          active={activeSection === 'tools'}
          onClick={() => setActiveSection('tools')}
          icon={<Wand2 size={24} />}
          label="Tools"
        />
      </div>

      {activeSection === 'glass' ? <GlassGenerator /> : <ImageTools />}
    </div>
  );
};

// --- Navigation Icon Component ---
const NavIcon: React.FC<NavIconProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
      active
        ? 'bg-white text-blue-600 shadow-lg'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-[9px] font-medium">{label}</span>
  </button>
);

// --- Glass Generator Component ---
const GlassGenerator: React.FC = () => {
  const [glassParams, setGlassParams] = useState<GlassParams>({
    shape: 'rectangle',
    blur: 16,
    opacity: 0.25,
    saturation: 110,
    color: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderOpacity: 0.4,
    shadowX: 0,
    shadowY: 8,
    shadowBlur: 32,
    shadowColor: '#1f2937',
    shadowOpacity: 0.15,
    noiseOpacity: 0.05,
    width: 400,
    height: 300,
  });

  const [bgImage, setBgImage] = useState<string>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('controls');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Presets
  const presets: Record<string, Partial<GlassParams>> = {
    defaults: {
      shape: 'rectangle',
      blur: 16,
      opacity: 0.25,
      saturation: 110,
      color: '#ffffff',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#ffffff',
      borderOpacity: 0.4,
      shadowX: 0,
      shadowY: 8,
      shadowBlur: 32,
      shadowColor: '#1f2937',
      shadowOpacity: 0.15,
      noiseOpacity: 0.05,
    },
    deepFrost: {
      shape: 'rectangle',
      blur: 24,
      opacity: 0.1,
      saturation: 140,
      color: '#ffffff',
      borderRadius: 30,
      borderWidth: 1.5,
      borderColor: '#ffffff',
      borderOpacity: 0.2,
      shadowX: 0,
      shadowY: 12,
      shadowBlur: 40,
      shadowColor: '#1f2937',
      shadowOpacity: 0.2,
      noiseOpacity: 0.08,
    },
    ceramic: {
      shape: 'rectangle',
      blur: 40,
      opacity: 0.7,
      saturation: 100,
      color: '#f3f4f6',
      borderRadius: 16,
      borderWidth: 0,
      borderColor: '#ffffff',
      borderOpacity: 0,
      shadowX: 0,
      shadowY: 4,
      shadowBlur: 16,
      shadowColor: '#1f2937',
      shadowOpacity: 0.1,
      noiseOpacity: 0.02,
    },
    holoDark: {
      shape: 'rectangle',
      blur: 20,
      opacity: 0.4,
      saturation: 120,
      color: '#111827',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#374151',
      borderOpacity: 0.5,
      shadowX: 0,
      shadowY: 10,
      shadowBlur: 24,
      shadowColor: '#1f2937',
      shadowOpacity: 0.4,
      noiseOpacity: 0.1,
    },
  };

  const sizePresets: SizePreset[] = [
    { name: 'Generic Card', w: 400, h: 300 },
    { name: 'SP Hero Card', w: 550, h: 350 },
    { name: 'SP Quick Link', w: 250, h: 150 },
    { name: 'Icon Background', w: 120, h: 120 },
    { name: 'Full Banner', w: 1200, h: 300 },
  ];

  const bgOptions: string[] = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop',
  ];

  // Handlers
  const handleParamChange = <K extends keyof GlassParams>(
    key: K,
    value: GlassParams[K]
  ): void => {
    if (key === 'shape' && value === 'circle') {
      const size = Math.min(glassParams.width, glassParams.height);
      setGlassParams((prev) => ({
        ...prev,
        shape: value as Shape,
        width: size,
        height: size,
      }));
      return;
    }
    if (glassParams.shape === 'circle' && (key === 'width' || key === 'height')) {
      setGlassParams((prev) => ({
        ...prev,
        width: value as number,
        height: value as number,
      }));
      return;
    }
    setGlassParams((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string): void => {
    setGlassParams((prev) => ({ ...prev, ...presets[presetName] }));
  };

  const applySize = (w: number, h: number): void => {
    if (glassParams.shape === 'circle') {
      const size = Math.min(w, h);
      setGlassParams((prev) => ({ ...prev, width: size, height: size }));
    } else {
      setGlassParams((prev) => ({ ...prev, width: w, height: h }));
    }
  };

  const getRadius = (): string => {
    if (glassParams.shape === 'circle') return '50%';
    if (glassParams.shape === 'pill') return '9999px';
    return `${glassParams.borderRadius}px`;
  };

  const generateCSS = (): string => {
    const {
      blur,
      saturation,
      opacity,
      color,
      borderWidth,
      borderColor,
      borderOpacity,
      shadowX,
      shadowY,
      shadowBlur,
      shadowColor,
      shadowOpacity,
    } = glassParams;

    const bgRgba = hexToRgba(color, opacity);
    const borderRgba = hexToRgba(borderColor, borderOpacity);
    const shadowRgba = hexToRgba(shadowColor, shadowOpacity);
    const finalRadius = getRadius();

    return `.glass-panel {
  /* Glassmorphism Base */
  background: ${bgRgba};
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  
  /* Border & Shape */
  border-radius: ${finalRadius};
  border: ${borderWidth}px solid ${borderRgba};
  
  /* Shadow for Depth */
  box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowRgba};
}`;
  };

  const copyToClipboard = async (): Promise<void> => {
    const code = generateCSS();
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Canvas drawing helper
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void => {
    const maxR = Math.min(w, h) / 2;
    const radius = r > maxR ? maxR : r;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  };

  const downloadImage = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const {
      width,
      height,
      opacity,
      color,
      borderWidth,
      borderColor,
      borderOpacity,
      shadowX,
      shadowY,
      shadowBlur,
      shadowColor,
      shadowOpacity,
    } = glassParams;

    let radius = glassParams.borderRadius;
    if (glassParams.shape === 'circle') radius = width / 2;
    if (glassParams.shape === 'pill') radius = 9999;

    const padding = 60;
    canvas.width = width + padding * 2;
    canvas.height = height + padding * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = padding;
    const y = padding;

    // 1. Draw Shadow
    ctx.save();
    ctx.shadowColor = hexToRgba(shadowColor, shadowOpacity);
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowX;
    ctx.shadowOffsetY = shadowY;

    ctx.fillStyle = hexToRgba(color, opacity);
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
    ctx.restore();

    // 2. Fill Background
    ctx.save();
    ctx.fillStyle = hexToRgba(color, opacity);
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
    ctx.restore();

    // 3. Draw Border
    if (borderWidth > 0) {
      ctx.save();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = hexToRgba(borderColor, borderOpacity);
      drawRoundedRect(ctx, x, y, width, height, radius);
      ctx.stroke();
      ctx.restore();
    }

    const link = document.createElement('a');
    link.download = 'sharepoint-glass-element.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
    }
  };

  const getTextColor = (): string => {
    return glassParams.color === '#000000' || glassParams.opacity > 0.8
      ? '#fff'
      : '#1f2937';
  };

  const getSubTextColor = (): string => {
    return glassParams.color === '#000000' || glassParams.opacity > 0.8
      ? '#eee'
      : '#4b5563';
  };

  return (
    <>
      {/* Sidebar Controls */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 shadow-xl z-20 flex flex-col h-[calc(100vh-80px)] md:h-screen overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-white z-10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Glass Studio
          </h1>
          <p className="text-xs text-gray-500 mt-1">Design</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {(['controls', 'sizes', 'css'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'controls' ? 'Design' : tab === 'sizes' ? 'Sizes' : 'Export'}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {activeTab === 'controls' && (
            <>
              {/* Presets */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {Object.keys(presets).map((key) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                  >
                    <div
                      className={`w-8 h-8 rounded-full mb-1 border shadow-sm ${
                        key === 'defaults'
                          ? 'bg-white'
                          : key === 'deepFrost'
                          ? 'bg-blue-50'
                          : key === 'holoDark'
                          ? 'bg-gray-800'
                          : 'bg-gray-100'
                      }`}
                    />
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      {key}
                    </span>
                  </button>
                ))}
              </div>

              {/* Shape Selector */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Maximize size={14} /> Shape
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(['rectangle', 'pill', 'circle'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => handleParamChange('shape', shape)}
                      className={`p-2 flex flex-col items-center gap-1 rounded-lg border transition-all ${
                        glassParams.shape === shape
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {shape === 'rectangle' && <Square size={18} />}
                      {shape === 'pill' && <Minus size={18} />}
                      {shape === 'circle' && <CircleIcon size={18} />}
                      <span className="text-[10px] font-medium capitalize">
                        {shape === 'rectangle' ? 'Rect' : shape}
                      </span>
                    </button>
                  ))}
                </div>
                {glassParams.shape === 'rectangle' && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600">
                        Corner Radius
                      </label>
                      <span className="text-xs text-gray-400">
                        {glassParams.borderRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glassParams.borderRadius}
                      onChange={(e) =>
                        handleParamChange('borderRadius', parseInt(e.target.value) || 0)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}
              </section>

              <hr className="border-gray-100" />

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers size={14} /> Surface
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">
                        Blur Strength
                      </label>
                      <span className="text-xs text-gray-400">{glassParams.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glassParams.blur}
                      onChange={(e) =>
                        handleParamChange('blur', parseInt(e.target.value) || 0)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">
                        Saturation
                      </label>
                      <span className="text-xs text-gray-400">{glassParams.saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={glassParams.saturation}
                      onChange={(e) =>
                        handleParamChange('saturation', parseInt(e.target.value) || 0)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">
                        Opacity (Tint)
                      </label>
                      <span className="text-xs text-gray-400">
                        {Math.round(glassParams.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glassParams.opacity * 100}
                      onChange={(e) =>
                        handleParamChange('opacity', parseInt(e.target.value) / 100)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">Tint Color</label>
                    <input
                      type="color"
                      value={glassParams.color}
                      onChange={(e) => handleParamChange('color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">
                        Border Width
                      </label>
                      <span className="text-xs text-gray-400">{glassParams.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={glassParams.borderWidth}
                      onChange={(e) =>
                        handleParamChange('borderWidth', parseInt(e.target.value) || 0)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">
                        Border Opacity
                      </label>
                      <span className="text-xs text-gray-400">
                        {Math.round(glassParams.borderOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glassParams.borderOpacity * 100}
                      onChange={(e) =>
                        handleParamChange('borderOpacity', parseInt(e.target.value) / 100)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">Border Color</label>
                    <input
                      type="color"
                      value={glassParams.borderColor}
                      onChange={(e) => handleParamChange('borderColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">
                        Noise Opacity
                      </label>
                      <span className="text-xs text-gray-400">
                        {Math.round(glassParams.noiseOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glassParams.noiseOpacity * 100}
                      onChange={(e) =>
                        handleParamChange('noiseOpacity', parseInt(e.target.value) / 100)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers size={14} /> Shadow
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">Shadow X Offset</label>
                      <span className="text-xs text-gray-400">{glassParams.shadowX}px</span>
                    </div>
                    <input type="range" min="-50" max="50" value={glassParams.shadowX} onChange={(e) => handleParamChange('shadowX', parseInt(e.target.value) || 0)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">Shadow Y Offset</label>
                      <span className="text-xs text-gray-400">{glassParams.shadowY}px</span>
                    </div>
                    <input type="range" min="-50" max="50" value={glassParams.shadowY} onChange={(e) => handleParamChange('shadowY', parseInt(e.target.value) || 0)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">Shadow Blur</label>
                      <span className="text-xs text-gray-400">{glassParams.shadowBlur}px</span>
                    </div>
                    <input type="range" min="0" max="100" value={glassParams.shadowBlur} onChange={(e) => handleParamChange('shadowBlur', parseInt(e.target.value) || 0)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">Shadow Opacity</label>
                      <span className="text-xs text-gray-400">{Math.round(glassParams.shadowOpacity * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={glassParams.shadowOpacity * 100} onChange={(e) => handleParamChange('shadowOpacity', parseInt(e.target.value) / 100)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">Shadow Color</label>
                    <input type="color" value={glassParams.shadowColor} onChange={(e) => handleParamChange('shadowColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden" />
                  </div>
                </div>
              </section>
            </>
          )}
          {activeTab === 'sizes' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Manual Dimensions
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={glassParams.width}
                    onChange={(e) =>
                      handleParamChange('width', parseInt(e.target.value) || 0)
                    }
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={glassParams.height}
                    onChange={(e) =>
                      handleParamChange('height', parseInt(e.target.value) || 0)
                    }
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                    disabled={glassParams.shape === 'circle'}
                    title={
                      glassParams.shape === 'circle'
                        ? 'Height is locked to width for Circles'
                        : ''
                    }
                  />
                </div>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                SharePoint Defaults
              </h3>
              <div className="space-y-2">
                {sizePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySize(preset.w, preset.h)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {preset.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {preset.w} x {preset.h}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 relative group">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy CSS"
                >
                  <Copy size={16} />
                </button>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                  {generateCSS()}
                </pre>
              </div>
              {copySuccess && (
                <p className="text-sm text-green-600 text-center">
                  CSS copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={downloadImage}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-gray-200"
          >
            <Download size={18} /> Download PNG Asset
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-80px)] md:h-screen">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-full px-2 py-1">
          <button
            onClick={() => setPreviewMode('desktop')}
            title="Desktop preview"
            aria-label="Desktop preview"
            aria-pressed={previewMode === 'desktop'}
            className={`p-2 rounded-full ${
              previewMode === 'desktop'
                ? 'bg-gray-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            title="Mobile preview"
            aria-label="Mobile preview"
            aria-pressed={previewMode === 'mobile'}
            className={`p-2 rounded-full ${
              previewMode === 'mobile'
                ? 'bg-gray-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Smartphone size={18} />
          </button>
          <span className="text-xs text-gray-500 hidden sm:inline">{previewMode === 'desktop' ? 'Desktop' : 'Mobile'}</span>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <div className="flex gap-1">
            {bgOptions.map((url, i) => (
              <button
                key={i}
                onClick={() => setBgImage(url)}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm overflow-hidden hover:scale-110 transition-transform"
              >
                <img src={url} alt="bg" className="w-full h-full object-cover" />
              </button>
            ))}
            <label className="w-6 h-6 rounded-full border-2 border-white shadow-sm overflow-hidden hover:scale-110 transition-transform bg-gray-100 flex items-center justify-center cursor-pointer">
              <ImageIcon size={12} className="text-gray-400" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBgUpload}
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-8 min-h-0">
          <div
            className={`relative bg-cover bg-center transition-all duration-500 ease-in-out shadow-2xl ${
              previewMode === 'mobile'
                ? 'w-[375px] h-[812px] rounded-[40px] border-8 border-gray-800'
                : 'w-full max-w-[1200px] h-[520px] md:h-[calc(100vh-220px)] rounded-xl overflow-hidden'
            }`}
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
          >
            <div className="absolute top-0 left-0 w-full h-12 bg-blue-600/90 backdrop-blur-sm z-10 flex items-center px-4">
              <div className="grid grid-cols-3 gap-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <span className="ml-4 text-white text-xs font-semibold">SharePoint</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4">
              <div
                className="relative flex flex-col items-center justify-center p-8 text-center transition-all duration-300"
                style={{
                  width: `${glassParams.width}px`,
                  height: `${glassParams.height}px`,
                  background: hexToRgba(glassParams.color, glassParams.opacity),
                   backdropFilter: `blur(${glassParams.blur}px) saturate(${glassParams.saturation}%)`,
                   WebkitBackdropFilter: `blur(${glassParams.blur}px) saturate(${glassParams.saturation}%)`,
                  borderRadius: getRadius(),
                  border: `${glassParams.borderWidth}px solid ${hexToRgba(
                    glassParams.borderColor,
                    glassParams.borderOpacity
                  )}`,
                  boxShadow: `${glassParams.shadowX}px ${glassParams.shadowY}px ${
                    glassParams.shadowBlur
                  }px ${hexToRgba(glassParams.shadowColor, glassParams.shadowOpacity)}`,
                }}
              >
                {glassParams.noiseOpacity > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{
                      opacity: glassParams.noiseOpacity,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                )}
                <h2 className="text-2xl font-bold mb-2" style={{ color: getTextColor() }}>
                  Glass Effect
                </h2>
                <p className="text-sm opacity-80" style={{ color: getSubTextColor() }}>
                  Shape: {glassParams.shape}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};

// --- Image Tools Component ---
const ImageTools: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [params, setParams] = useState<ImageToolParams>({
    scale: 2,
    targetW: 800,
    targetH: 600,
    mode: 'scale',
    sharpen: true,
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setParams((p) => ({ ...p, targetW: img.width, targetH: img.height }));
      };
      img.src = url;
    }
  };

  const processImage = (): void => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setProcessing(true);

    // Use requestAnimationFrame to not block UI
    requestAnimationFrame(() => {
      const newW =
        params.mode === 'scale' ? image.width * params.scale : params.targetW;
      const newH =
        params.mode === 'scale' ? image.height * params.scale : params.targetH;

      canvas.width = newW;
      canvas.height = newH;

      // High Quality Resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, newW, newH);

      const link = document.createElement('a');
      link.download = `processed-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 0.9);
      link.click();

      setProcessing(false);
    });
  };

  const getResultDimensions = (): { width: number; height: number } => {
    if (!image) return { width: 0, height: 0 };
    return {
      width:
        params.mode === 'scale'
          ? Math.round(image.width * params.scale)
          : params.targetW,
      height:
        params.mode === 'scale'
          ? Math.round(image.height * params.scale)
          : params.targetH,
    };
  };

  const resultDims = getResultDimensions();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-screen overflow-hidden">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Image Tools</h2>
        <p className="text-sm text-gray-500">
          Resize and optimize images for SharePoint headers and web parts.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row p-8 gap-8 overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Upload size={16} /> Source
            </h3>
            <label className="block w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />
              <span className="text-sm text-gray-500 font-medium">
                Click to Upload Image
              </span>
            </label>
            {image && (
              <div className="mt-2 text-xs text-gray-400 text-center">
                Original: {image.width} x {image.height}px
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Scaling size={16} /> Resize Settings
            </h3>

            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setParams((p) => ({ ...p, mode: 'scale' }))}
                className={`flex-1 py-1 text-xs font-medium rounded ${
                  params.mode === 'scale'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                By Scale
              </button>
              <button
                onClick={() => setParams((p) => ({ ...p, mode: 'manual' }))}
                className={`flex-1 py-1 text-xs font-medium rounded ${
                  params.mode === 'manual'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                Dimensions
              </button>
            </div>

            {params.mode === 'scale' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Scale Factor: {params.scale}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    value={params.scale}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, scale: parseFloat(e.target.value) }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                  Result: {resultDims.width} x {resultDims.height}px
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Target Width</label>
                  <input
                    type="number"
                    value={params.targetW}
                    onChange={(e) =>
                      setParams((p) => ({
                        ...p,
                        targetW: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Target Height</label>
                  <input
                    type="number"
                    value={params.targetH}
                    onChange={(e) =>
                      setParams((p) => ({
                        ...p,
                        targetH: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Activity size={16} /> Enhancements
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={params.sharpen}
                onChange={(e) => setParams((p) => ({ ...p, sharpen: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Apply Smart Sharpen
            </label>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
              *Note: True AI Upscaling (adding new detail) requires server-side
              processing. This tool uses high-quality bicubic resampling with
              sharpening, ideal for general SharePoint asset optimization.
            </p>
          </div>

          <button
            disabled={!image || processing}
            onClick={processImage}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
          >
            {processing ? 'Processing...' : 'Process & Download'}
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center border border-gray-300 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <ImageIcon size={48} className="mb-2 opacity-50" />
              <span className="text-sm">No image loaded</span>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SharePointGlassStudio;
