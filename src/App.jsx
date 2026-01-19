import React, { useState, useEffect } from 'react';
import { Zap, Activity, Info, Settings, BatteryCharging, ArrowRightLeft } from 'lucide-react';

const App = () => {
  // 狀態管理
  const [calcMode, setCalcMode] = useState('ampToKw'); // 'ampToKw' or 'kwToAmp'
  const [phaseMode, setPhaseMode] = useState('1'); // '1' or '3'
  const [voltage, setVoltage] = useState(220);
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState(0);

  // 當相數改變時，自動調整預設電壓
  useEffect(() => {
    if (phaseMode === '1') {
      setVoltage(220);
    } else {
      setVoltage(380);
    }
    // 重置輸入以避免混淆
    setResult(0);
  }, [phaseMode]);

  // 計算邏輯
  useEffect(() => {
    const val = parseFloat(inputVal);
    if (isNaN(val) || val < 0) {
      setResult(0);
      return;
    }

    let calculated = 0;
    const v = parseFloat(voltage);

    if (calcMode === 'ampToKw') {
      // 電流 (A) -> 功率 (kW)
      // 單相: P = V * I / 1000
      // 三相: P = √3 * V * I / 1000 (假設功率因數 PF 為 1)
      if (phaseMode === '1') {
        calculated = (v * val) / 1000;
      } else {
        calculated = (Math.sqrt(3) * v * val) / 1000;
      }
    } else {
      // 功率 (kW) -> 電流 (A)
      // 單相: I = (P * 1000) / V
      // 三相: I = (P * 1000) / (√3 * V)
      if (phaseMode === '1') {
        calculated = (val * 1000) / v;
      } else {
        calculated = (val * 1000) / (Math.sqrt(3) * v);
      }
    }

    setResult(calculated);
  }, [inputVal, voltage, phaseMode, calcMode]);

  // 參考數據表
  const references = [
    { type: '家用插座 (13A)', phase: '單相', voltage: '220V', current: '13A', power: '~ 2.8 kW' },
    { type: '中速充電 (16A)', phase: '單相', voltage: '220V', current: '16A', power: '~ 3.5 kW' },
    { type: '標準中速 (32A)', phase: '單相', voltage: '220V', current: '32A', power: '~ 7.0 kW' },
    { type: '三相中速 (16A)', phase: '三相', voltage: '380V', current: '16A', power: '~ 11 kW' },
    { type: '三相快速 (32A)', phase: '三相', voltage: '380V', current: '32A', power: '~ 22 kW' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl shadow-blue-200 shadow-lg">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">EV 充電計算機</h1>
              <p className="text-slate-500 text-sm">電流 (A) 與 功率 (kW) 快速換算</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Calculator Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              
              {/* Mode Tabs */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setCalcMode('ampToKw')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    calcMode === 'ampToKw' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  電流 ➜ 功率 (kW)
                </button>
                <button
                  onClick={() => setCalcMode('kwToAmp')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    calcMode === 'kwToAmp' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  功率 ➜ 電流 (A)
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Phase Selection */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">供電相數 (Phase)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPhaseMode('1')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        phaseMode === '1'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-slate-900">單相 (1-Phase)</div>
                      <div className="text-xs text-slate-500 mt-1">一般家用 / 慢充</div>
                      {phaseMode === '1' && <div className="absolute top-3 right-3 w-3 h-3 bg-blue-600 rounded-full" />}
                    </button>
                    <button
                      onClick={() => setPhaseMode('3')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        phaseMode === '3'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-slate-900">三相 (3-Phase)</div>
                      <div className="text-xs text-slate-500 mt-1">商用 / 中快充</div>
                      {phaseMode === '3' && <div className="absolute top-3 right-3 w-3 h-3 bg-blue-600 rounded-full" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Voltage Input */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-400" />
                      電壓 (V)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={voltage}
                        onChange={(e) => setVoltage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <span className="absolute right-4 top-3 text-slate-400 font-medium">Volts</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {phaseMode === '1' ? '預設: 220V' : '預設: 380V (線電壓)'}
                    </p>
                  </div>

                  {/* Dynamic Input (Amps or kW) */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <BatteryCharging className="w-4 h-4 text-slate-400" />
                      {calcMode === 'ampToKw' ? '輸入電流 (A)' : '輸入功率 (kW)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <span className="absolute right-4 top-3 text-slate-400 font-medium">
                        {calcMode === 'ampToKw' ? 'Amps' : 'kW'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result Display */}
                <div className="bg-slate-900 rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  <p className="text-slate-400 text-sm font-medium mb-1">
                    計算結果 ({calcMode === 'ampToKw' ? '功率' : '電流'})
                  </p>
                  <div className="text-5xl font-bold text-white tracking-tight my-2">
                    {result.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                    <span className="text-2xl text-slate-500 ml-2 font-normal">
                       {calcMode === 'ampToKw' ? 'kW' : 'A'}
                    </span>
                  </div>
                  {/* Phase visualization */}
                  <div className="flex justify-center gap-1 mt-4 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {phaseMode === '3' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold mb-1">計算公式說明：</p>
                <ul className="list-disc pl-4 space-y-1 opacity-90">
                  <li>單相功率 = 電壓(V) × 電流(A) ÷ 1000</li>
                  <li>三相功率 = √3 (1.732) × 線電壓(V) × 電流(A) ÷ 1000</li>
                  <li>實際充電速度可能受限於車載充電器 (OBC) 或電網負載。</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar: Reference Table */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                常見規格參考表
              </h3>
              
              <div className="space-y-3">
                {references.map((ref, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                        setPhaseMode(ref.phase === '單相' ? '1' : '3');
                        setCalcMode('ampToKw');
                        setInputVal(ref.current.replace(/[^0-9.]/g, ''));
                    }}
                    className="group p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-700 text-sm">{ref.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        ref.phase === '單相' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {ref.phase}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>{ref.voltage} / {ref.current}</span>
                      <span className="font-mono font-bold text-blue-600 group-hover:text-blue-700">{ref.power}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
                點擊上方列表可直接套用數值
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;