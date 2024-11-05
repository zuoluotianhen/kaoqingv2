import React, { useState } from 'react';
import { Calendar, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Header() {
  const [isEditing, setIsEditing] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const monthInChinese = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  const handlePrint = async () => {
    try {
      // Add printing class to hide action buttons
      document.body.classList.add('is-printing');
      
      const element = document.getElementById('printable-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Ensure gradients are visible in the clone
          const header = clonedDoc.querySelector('.header-gradient');
          if (header) {
            header.style.transform = 'none';
            header.style.background = 'linear-gradient(to right, #22c55e, #059669)';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `请假记录_${year}年${month}月.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败，请重试');
    } finally {
      // Remove printing class
      document.body.classList.remove('is-printing');
    }
  };

  const handleDateClick = () => {
    setIsEditing(true);
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="relative mb-12">
      <div className="header-gradient absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 transform -skew-y-2"></div>
      <div className="relative py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Calendar className="text-white mr-2" size={32} />
            <h1 className="text-4xl font-bold text-white">请假记录管理</h1>
            <button
              onClick={handlePrint}
              className="print-hide ml-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
              title="导出为图片"
            >
              <Printer className="text-white" size={24} />
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleDateSubmit} className="flex items-center justify-center space-x-4">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-20 px-2 py-1 rounded bg-white/90 text-gray-800 text-center"
                min="2000"
                max="2100"
              />
              <span className="text-white">年</span>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-20 px-2 py-1 rounded bg-white/90 text-gray-800"
              >
                {monthInChinese.map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <span className="text-white">月</span>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
              >
                确定
              </button>
            </form>
          ) : (
            <div
              onClick={handleDateClick}
              className="flex items-center justify-center space-x-2 text-white/90 cursor-pointer hover:text-white transition-colors duration-200"
            >
              <span className="text-xl">{year}年</span>
              <div className="w-px h-6 bg-white/30"></div>
              <span className="text-xl">{monthInChinese[month - 1]}月</span>
            </div>
          )}
        </div>
      </div>
      <div className="header-gradient absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 transform skew-y-2 -z-10 opacity-30"></div>
    </div>
  );
}