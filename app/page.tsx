"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, animate, useMotionValue } from 'framer-motion';
import { ChevronDown, ExternalLink, Mail, MapPin, Zap, Brain, Bot, Phone, MessageCircle, ArrowDown, TrendingUp, Users, Clock, Eye, ScanLine, Code2, Rocket } from 'lucide-react';
// --- 3D 依赖 ---
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei'; 
import * as THREE from 'three';

// --- 真实履历数据 ---
const EXPERIENCE = [
  {
    id: 0, 
    company: "BRIGHTOIL (光汇石油)",
    role: "AI Product Manager",
    period: "2025.05 - Present",
    desc: "负责 AI 与数字化员工体系建设，打造“AI+办公”全链路生态，推出企业智能化低代码办公平台。",
    highlights: [
      "构建企业级 AI Agent 中台：集成 DeepResearch 与 RAG 深度搜索，打破数据孤岛，支持复杂业务意图识别与 Text-to-SQL 自动生成。",
      "落地“AI+数字员工”体系：融合 ASR/TTS/NLP 与 Unity 3D 数字人技术，打造 7x24 小时智能业务助手，覆盖客服与办公全场景。",
      "构建自动化 Workflow 生态：通过 Agent 编排实现会议纪要生成、合同智能撰写与审批流自动化，显著提升企业协同效率 40%+。",
      "设计商业化闭环：建立 Token 分层计费与配额管理体系，成功将内部 AI 能力转化为可量化的商业服务产品（SaaS化）。"
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
  },
  {
    id: 1,
    company: "BIGO (欢聚集团)",
    role: "AI Product Manager",
    period: "2023.09 - 2025.05",
    desc: "负责全球内容生态策略，构建“生成-理解-分发”的 AIGC 闭环，主导安全风控与商业化变现。",
    highlights: [
      "构建智能问答 Agent：覆盖 20+ 语种，日均处理 5000+ 查询，减少外包人力投入 70%",
      "打造中东社交机器人：基于用户画像定制 Prompt，提升付费转化率与用户留存 -- 作为项目产品参与Google Best of 2023大会",
      "搭建新闻热点 AIGC 链路：实现全自动爬取、清洗与生成，内容生产效率提升 95%",
      "升级安全风控体系：未成年账号识别率达 98.2%，恋童癖模型准确率提升 25%"
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
  },
  {
    id: 2,
    company: "QUWAN (趣丸/TT)",
    role: "AI Product Manager",
    period: "2022.03 - 2023.09",
    desc: "负责 AIGC 场景落地、智能运营平台搭建及内容安全中台重构。",
    highlights: [
      "AI 人设机器人落地：部署 20+ 种人设 Bot，新用户次留指标提升 4%",
      "搭建智能运营触达平台：结合 AIGC 生成个性化文案，应用点击率提升 30%",
      "构建短信中台：通过精细化策略优化触达路径，降低短信成本 10%-30%",
      "主导内容审核中台重构：推行敏捷开发，实现音频/文本/图像风控全链路闭环"
    ],
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop"
  },
  {
    id: 3,
    company: "XPENG (小鹏汽车)",
    role: "Product Specialist",
    period: "2021.08 - 2022.01",
    desc: "参与企业级项目管理系统与技术中台的规划与从 0 到 1 建设。",
    highlights: [
      "规划 PMS 项目管理系统：输出详细设计文档，支撑研发全流程管理",
      "建设 BPM 流程平台：实现服务编排与统一待办，提升内部审批效率",
      "重构技术中台：优化消息服务与文件服务模块，支持多业务线高效复用"
    ],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop"
  }
];

// ------------------------------------------------------------------
// 3D SCENE COMPONENTS
// ------------------------------------------------------------------

const Lasers = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
  const count = 80; 
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 100;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scroll = scrollProgress.current;
    const color = new THREE.Color(scroll > 0.1 ? '#ffffff' : '#ff0000');
    
    // @ts-ignore
    if(meshRef.current.material) {
        // @ts-ignore
        meshRef.current.material.emissive = color;
        // @ts-ignore
        meshRef.current.material.emissiveIntensity = 3 + scroll * 20;
    }

    particles.forEach((particle, i) => {
      let { t, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed;
      
      let x = (particle.mx += (state.mouse.x * viewport.width - particle.mx) * 0.02) + Math.cos(t / 10) * xFactor + Math.sin(t * 1) * 10;
      let y = (particle.my += (state.mouse.y * viewport.height - particle.my) * 0.02) + Math.sin(t / 10) * yFactor + Math.cos(t * 2) * 10;
      let z = (particle.mx += (state.mouse.x * viewport.width - particle.mx) * 0.02) + Math.cos(t / 10) * zFactor + Math.sin(t * 3) * 10;

      if (scroll > 0) {
        const convergeStrength = Math.min(scroll * 2, 1); 
        x = THREE.MathUtils.lerp(x, 0, convergeStrength);
        y = THREE.MathUtils.lerp(y, 0, convergeStrength);
        z = THREE.MathUtils.lerp(z, -5, convergeStrength);
        
        const scaleFactor = 1 + scroll * 20; 
        dummy.scale.set(1, 1, scaleFactor * 5); 
      } else {
        dummy.scale.set(1, 1, 1);
      }

      dummy.position.set(x, y, z);
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.04, 0.04, 15, 8]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#ff0000" 
        emissiveIntensity={4} 
        transparent 
        opacity={0.7}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

const BackgroundScene = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 45 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <color attach="background" args={['#050505']} />
      <Stars radius={100} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -5]} intensity={1} color="red" />
      <Suspense fallback={null}>
        <Lasers scrollProgress={scrollProgress} />
      </Suspense>
      <fog attach="fog" args={['#000000', 8, 40]} />
    </Canvas>
  );
};

// ------------------------------------------------------------------
// UI COMPONENTS
// ------------------------------------------------------------------

const SideNavHint = ({ targetId, label, subLabel = "NEXT" }: { targetId: string, label: string, subLabel?: string }) => {
  return (
    <motion.a 
      href={`#${targetId}`}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="absolute left-4 md:left-8 bottom-32 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 group cursor-pointer no-underline flex md:flex-col items-start md:items-center gap-3"
    >
      <div className="w-1 h-12 md:h-24 bg-gradient-to-b from-yellow-500 to-transparent/20 rounded-full opacity-60 group-hover:opacity-100 group-hover:h-16 md:group-hover:h-32 transition-all duration-500" />
      <div className="flex flex-col items-start md:items-start">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-yellow-500 transition-colors duration-300 font-mono mb-1">
          {subLabel}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-lg font-['Antonio'] uppercase text-white/80 group-hover:text-white transition-colors tracking-widest font-bold whitespace-nowrap shadow-black drop-shadow-md">
            {label}
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown size={16} className="text-yellow-500" /> 
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const scrollRef = useRef(0);
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => { scrollRef.current = v; });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 40]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const flashOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]); 

  return (
    <section id="about" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-black z-10 sticky top-0 flex flex-col justify-center py-32">
      <div className="absolute inset-0 z-0"><BackgroundScene scrollProgress={scrollRef} /></div>
      <motion.div style={{ opacity: flashOpacity }} className="absolute inset-0 z-30 bg-white pointer-events-none mix-blend-screen" />
      <motion.div style={{ scale, opacity, y: textY }} className="z-20 relative flex flex-col justify-center items-center w-full px-4 h-full">
        <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] md:text-[14vw] font-['Antonio'] font-bold text-transparent tracking-widest select-none pointer-events-none whitespace-nowrap" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>HANCKS LIU</h2>
        <h1 className="relative text-6xl md:text-[10rem] font-black tracking-tight font-['Noto_Sans_SC'] text-white leading-tight text-center" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.8)', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>刘 畅</h1>
        <div className="mt-4 md:mt-8 flex flex-col items-center gap-6">
          <p className="text-2xl md:text-4xl font-['Antonio'] font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] via-[#FFA500] to-[#FF8C00]" style={{ WebkitTextStroke: '1.5px black', textShadow: '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 140, 0, 0.4)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'}}>HANCKS</p>
          <motion.div style={{ opacity: subOpacity }} className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-2" />
          <motion.div style={{ opacity: subOpacity }} className="flex flex-col items-center gap-4 text-center max-w-4xl px-4">
             <p className="text-base md:text-xl text-white/90 font-['Noto_Sans_SC'] font-bold tracking-wider leading-relaxed">高级 AI 产品 <span className="text-yellow-500 mx-2">•</span> 4年+ 实战经验 <span className="text-yellow-500 mx-2">•</span> 亿级用户增长验证</p>
             <p className="text-sm md:text-base text-white/60 font-['Noto_Sans_SC'] mt-2 max-w-2xl leading-relaxed font-light">深耕 AIGC 内容生态与企业数字化转型。擅长构建 <span className="text-yellow-400 font-medium">AI Agent 中台</span> 与 <span className="text-yellow-400 font-medium">数字员工体系</span>，致力于融合 <span className="text-white/70">Agentic</span> 等前沿技术重塑业务流程，实现从 0 到 1 的商业价值落地。</p>
          </motion.div>
          <motion.div style={{ opacity: subOpacity }} className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
            <a href="tel:15113912833" className="flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-yellow-900/30 hover:border-yellow-500/50 transition-all group cursor-pointer hover:scale-105"><Phone size={18} className="text-yellow-500 group-hover:text-white transition-colors" /><span className="text-sm md:text-base text-white/90 font-mono tracking-wider">151-1391-2833</span></a>
            <div className="flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-green-900/30 hover:border-green-500/50 transition-all group cursor-default hover:scale-105"><MessageCircle size={18} className="text-green-500 group-hover:text-white transition-colors" /><span className="text-sm md:text-base text-white/90 font-mono tracking-wider">WeChat: 15113912833</span></div>
            <a href="mailto:15113912833@139.com" className="flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-blue-900/30 hover:border-blue-500/50 transition-all group cursor-pointer hover:scale-105"><Mail size={18} className="text-blue-400 group-hover:text-white transition-colors" /><span className="text-sm md:text-base text-white/90 font-mono tracking-wider">Email Me</span></a>
          </motion.div>
        </div>
      </motion.div>
      <SideNavHint targetId="experience-0" label="Experience" />
      <motion.div style={{ opacity: subOpacity }} animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-2 z-30 pointer-events-none"><span className="text-[10px] uppercase tracking-widest text-yellow-500/30">Scroll to Explore</span><ChevronDown size={24} className="text-yellow-500/50" /></motion.div>
    </section>
  );
};

// Experience Card
const ExperienceCard = ({ item, index, isLast }: { item: any, index: number, isLast: boolean }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]); 
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.85]);
  const blurValue = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [15, 0, 0, 20]);
  const brightnessValue = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.2]);
  const filter = useMotionTemplate`blur(${blurValue}px) brightness(${brightnessValue})`;

  const nextTarget = isLast ? "personal-projects" : `experience-${index + 1}`;
  const nextLabel = isLast ? "PERSONAL PROJECTS" : EXPERIENCE[index+1].company.split(' ')[0].toUpperCase();

  return (
    <div id={`experience-${index}`} ref={ref} className="relative min-h-screen w-full flex items-center justify-center md:sticky md:top-0 py-20 md:py-0" style={{ zIndex: index + 20 }}>
      <motion.div style={{ y, filter }} className="absolute inset-0 w-full h-full z-0 transition-all duration-100"><img src={item.image} alt={item.company} className="w-full h-full object-cover grayscale-[30%]" /><div className="absolute inset-0 bg-black/60"></div></motion.div>
      <motion.div style={{ opacity, scale }} className="relative z-10 w-[95%] md:w-[90%] max-w-5xl h-fit bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-12 rounded-3xl shadow-2xl text-white flex flex-col justify-center">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-white/10 pb-6 shrink-0">
          <div><h2 className="text-2xl md:text-5xl font-bold tracking-tight text-yellow-50 font-['Antonio'] uppercase break-words">{item.company}</h2><p className="text-base md:text-2xl text-yellow-500 font-['Antonio'] mt-2 flex items-start gap-2 break-words"><span className="mt-1 shrink-0">{index === 0 ? <Bot size={20} /> : <Brain size={20} />}</span><span className="leading-tight">{item.role}</span></p></div>
          <span className="text-xs md:text-lg font-mono text-white/50 mt-2 md:mt-0 bg-white/5 px-3 py-1 rounded border border-white/5 shrink-0">{item.period}</span>
        </div>
        {/* 修复点：使用 HTML 转义字符 &quot; 替代直接的双引号 */}
        <p className="text-sm md:text-lg leading-relaxed text-gray-300 font-light mb-6 italic border-l-2 border-yellow-500 pl-4 shrink-0">&quot;{item.desc}&quot;</p>
        <div className="grid grid-cols-1 gap-3 pb-4">{item.highlights.map((point: string, i: number) => (<div key={i} className="flex items-start group p-2 hover:bg-white/5 rounded-lg transition-colors"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-3 group-hover:scale-150 transition-transform shrink-0" /><p className="text-sm md:text-base text-gray-200 font-['Noto_Sans_SC'] group-hover:text-white transition-colors leading-relaxed">{point}</p></div>))}</div>
      </motion.div>
      <SideNavHint targetId={nextTarget} label={nextLabel} />
    </div>
  );
};

// --- NEW COMPONENT: Projects and Gallery with QR Code AND Dashboard ---
const ProjectsAndGallery = () => {
  // Use the uploaded image filename, referencing from public folder
  const qrCodeImage = "/image_c5bb5d.png"; 
  
  const stats = [
    { label: "累计用户", value: "4,078", icon: Users, trend: "+3.53%", trendColor: "text-green-500" },
    { label: "日访问人数", value: "31", icon: TrendingUp, trend: "+61.53%", trendColor: "text-green-500" },
    { label: "日打开次数", value: "50", icon: Eye, trend: "+50%", trendColor: "text-green-500" },
    { label: "日访问页面", value: "107", icon: Clock, trend: "+98.14%", trendColor: "text-green-500" },
  ];

  const chartData = [14, 16, 19, 20, 21, 22, 26, 30, 32, 34, 36, 37, 38];

  // Updated Photos Array with local files
  const photos = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png",
    "/6.png",
    "/7.png",
    "/8.png",
    "/9.png"
  ];
  
  const duplicatedPhotos = [...photos, ...photos];
  const xTranslation = useMotionValue(0);

  useEffect(() => {
    // Adjust width based on 6 photos * 320px width/gap
    const finalPosition = -1 * (photos.length * 320);
    const controls = animate(xTranslation, [0, finalPosition], {
      ease: "linear",
      duration: 40,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });
    return controls.stop;
  }, [xTranslation, photos.length]);

  return (
    <section id="personal-projects" className="min-h-screen bg-black py-32 px-6 z-30 relative border-t border-yellow-900/30 flex flex-col gap-32">
      
      {/* Part 1: AI Mini-Program Intro + Data + QR Code */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Text Intro */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
               <Code2 size={14} /> Indie Developer (个人独立开发)
             </span>
             <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
               <Rocket size={14} /> Commercialized
             </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-['Antonio'] text-yellow-600 uppercase">
            AI Sunset Guide
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 font-['Noto_Sans_SC'] border-l-4 border-yellow-500 pl-4">
            日出日落指南小程序
          </h3>
          <p className="text-white/70 text-lg mb-6 font-['Noto_Sans_SC'] leading-relaxed">
            这是一款由我<strong className="text-white font-bold">个人独立设计与开发</strong>的 AI 工具类产品。它创新性地结合了 LBS 定位与实时天文算法，帮助摄影爱好者和游客在任何景点都能精准找到无遮挡的地平线日出日落观赏位。
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Zap className="text-yellow-500 mt-1" size={18} />
              <span className="text-white/80 font-['Noto_Sans_SC']">核心功能：AI 识别地形遮挡，计算最佳拍摄时间窗口。</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="text-green-500 mt-1" size={18} />
              <span className="text-white/80 font-['Noto_Sans_SC']">商业价值：上线即获得自然流量增长，已接入广告变现。</span>
            </li>
          </ul>
        </div>

        {/* Right: Data Dashboard & QR Code */}
        <div className="flex flex-col gap-8">
          {/* 1. Data Dashboard */}
          <div className="bg-neutral-900/50 rounded-3xl p-6 md:p-8 border border-yellow-900/20 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white font-['Antonio'] uppercase tracking-wider">Growth Metrics</h3>
              <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-xs text-green-500 font-mono">LIVE</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-white font-mono">{stat.value}</span>
                    <span className={`text-[10px] ${stat.trendColor} mb-1`}>{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 relative h-32 flex items-end justify-between px-2 gap-1 overflow-hidden">
               {/* Mock Chart */}
               {chartData.map((val, i) => (
                  <div key={i} style={{ height: `${(val/40)*100}%` }} className="w-full bg-yellow-500/20 rounded-t-sm relative group"></div>
               ))}
            </div>
          </div>

          {/* 2. QR Code Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center justify-between gap-6 group"
          >
            <div className="flex-1">
                <h4 className="text-white font-bold text-lg font-['Noto_Sans_SC'] mb-1 flex items-center gap-2">
                  <ScanLine size={18} className="text-yellow-500"/> 立即体验
                </h4>
                <p className="text-white/40 text-xs font-mono">SCAN TO LAUNCH</p>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
              {/* Larger QR Code */}
              <img 
                src={qrCodeImage} 
                alt="Mini Program QR" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain" 
                // Fallback if local image is not found in public folder
                onError={(e) => {e.currentTarget.src="https://via.placeholder.com/300x300.png?text=QR+Code"}}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Part 2: Infinite Photo Wall (Local Images) */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-end justify-between">
           <div>
             <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-['Antonio'] text-yellow-600 uppercase">
               Life Gallery
             </h2>
             <p className="text-white/40 text-sm mt-2 font-mono">CAPTURED MOMENTS & FOOTPRINTS</p>
           </div>
           <div className="h-px bg-white/10 flex-grow ml-8 mb-4" />
        </div>
        
        <div className="w-full overflow-hidden py-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-20" />
          
          <motion.div 
            className="flex gap-6 pl-6 w-max"
            style={{ x: xTranslation }}
          >
            {duplicatedPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="relative h-72 w-[280px] min-w-[280px] rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={photo} 
                  alt={`Gallery photo ${index}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  // Fallback to random Unsplash image if local not found
                  onError={(e) => {e.currentTarget.src=`https://images.unsplash.com/photo-${1500000000000 + index}?q=80&w=400&auto=format&fit=crop`}}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                   <p className="text-white text-xs font-mono">MOMENT #{index + 1}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <SideNavHint targetId="contact" label="GET IN TOUCH" />
    </section>
  );
};

// --- 组件: 导航 ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <motion.nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-yellow-900/30' : 'bg-transparent'}`}><span className="text-white font-bold tracking-widest text-xl font-['Antonio'] text-yellow-500 flex items-center gap-2"><Zap size={20} fill="currentColor" /> HANCKS.OS</span><div className="hidden md:flex gap-8 text-sm font-medium text-white/80 font-['Antonio'] tracking-wider"><a href="#about" className="hover:text-yellow-500 transition-colors">ABOUT</a><a href="#experience-0" className="hover:text-yellow-500 transition-colors">EXPERIENCE</a><a href="#personal-projects" className="hover:text-yellow-500 transition-colors">PROJECTS</a></div></motion.nav>
  );
};

// --- 主程序 ---
export default function PortfolioWebsite() {
  return (
    <div className="bg-black min-h-screen font-sans selection:bg-yellow-900 selection:text-white overflow-x-hidden scroll-smooth">
      <Navbar />
      <HeroSection />
      <div className="relative z-20 bg-black">
        {EXPERIENCE.map((item, index) => (
          <ExperienceCard 
            key={item.id} 
            item={item} 
            index={index} 
            isLast={index === EXPERIENCE.length - 1}
          />
        ))}
      </div>
      {/* Using the updated QR + Dashboard + Photo Wall component */}
      <ProjectsAndGallery />
      
      <footer id="contact" className="bg-black py-24 border-t border-yellow-900/30 text-center relative z-30"><h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-['Antonio'] text-yellow-700/80 uppercase">Ready to Connect?</h2><div className="flex flex-col items-center gap-4 text-white/60 mb-12"><div className="flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer group"><Phone size={20} className="group-hover:animate-bounce" /><span className="font-mono tracking-widest">151 1391 2833</span></div><div className="flex items-center gap-2 hover:text-green-500 transition-colors cursor-pointer group"><MessageCircle size={20} /><span className="font-mono">WeChat: 15113912833</span></div><div className="flex items-center gap-2 hover:text-red-500 transition-colors cursor-pointer group"><Mail size={20} className="group-hover:animate-bounce" /><span className="font-mono">15113912833@139.com</span></div><div className="flex items-center gap-2 hover:text-yellow-500 transition-colors"><MapPin size={20} /><span className="font-mono">ShenZhen/GuangZhou, China</span></div></div><p className="text-neutral-700 text-xs font-mono">© 2025 HANCKS LIU. POWERED BY NEXT.JS & REACT MOTION.</p></footer>
    </div>
  );
}
