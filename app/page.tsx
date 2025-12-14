"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, BookOpen, Award, ChevronDown, GraduationCap, Languages, Mountain, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { useEffect, useState } from "react";
import { db } from "@/lib/db"; // Import db client
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define types based on Prisma schema
type Course = {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Purchase = {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CourseWithProgress = Course & {
  chapters: { id: string }[];
  quizzes: { id: string }[];
  purchases: Purchase[];
  progress: number;
};

export default function HomePage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // Fetch courses from public API endpoint
        const response = await fetch("/api/courses/public");
        
        if (!response.ok) {
          console.error("Failed to fetch courses:", response.status, response.statusText);
          return;
        }
        
        const data = await response.json();
        console.log("Fetched courses:", data); // Debug log
        setCourses(data);

      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollIndicator(entry.isIntersecting);
      },
      {
        threshold: 0.5, // Trigger when 50% of the hero section is visible
      }
    );

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  const scrollToCurriculum = () => {
    const curriculumSection = document.getElementById('curriculum-section');
    if (curriculumSection) {
      const offset = curriculumSection.offsetTop - 80; // Adjust for navbar height
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-full w-full bg-background">
      <Navbar />
      <ScrollProgress />
      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0 bg-gradient-to-t from-brand/25 via-brand/10 to-transparent">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-center">
          {/* Image Section - First on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center order-1 md:order-2"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/teacher-image.png"
                alt="اكاديمية القمة"
                fill
                priority
                className="object-cover rounded-full border-4 border-brand/20 shadow-lg"
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
            
            {/* Floating Cards - Desktop Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="hidden md:block absolute top-1 -right-2 md:-right-4 z-10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-brand/20 backdrop-blur-sm rounded-lg border-2 border-brand shadow-lg px-3 py-2 flex items-center gap-2 min-w-[140px]">
                <div className="bg-brand/30 rounded-full p-1.5">
                  <GraduationCap className="h-5 w-5 text-brand" />
                </div>
                <span className="text-brand text-sm font-semibold whitespace-nowrap">مستقبلك يبدأ هنا</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -12, 0],
              }}
              transition={{ 
                duration: 0.5, 
                delay: 0.7,
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="hidden md:block absolute bottom-1/3 left-6 md:left-8 z-10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-brand/20 backdrop-blur-sm rounded-lg border-2 border-brand shadow-lg px-3 py-2 flex items-center gap-2 min-w-[140px]">
                <div className="bg-brand/30 rounded-full p-1.5">
                  <Rocket className="h-5 w-5 text-brand" />
                </div>
                <span className="text-brand text-sm font-semibold whitespace-nowrap">انطلق للأفضل</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -18, 0],
              }}
              transition={{ 
                duration: 0.5, 
                delay: 0.9,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="hidden md:block absolute top-1/2 -right-6 md:-right-8 z-10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-brand/20 backdrop-blur-sm rounded-lg border-2 border-brand shadow-lg px-3 py-2 flex items-center gap-2 min-w-[140px]">
                <div className="bg-brand/30 rounded-full p-1.5">
                  <Mountain className="h-5 w-5 text-brand" />
                </div>
                <span className="text-brand text-sm font-semibold whitespace-nowrap">البداية نحو القمة</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Section - Second on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-0 md:mt-0 order-2 md:order-1"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-brand">اكاديمية القمة</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              طريقك الي النجاح
            </p>
            <Button size="lg" asChild className="bg-brand hover:bg-brand/90 text-white">
              <Link href="/sign-up">
                ابدأ الآن <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2 cursor-pointer hidden md:flex"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={scrollToCurriculum}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Curriculum Selection Section */}
      <section id="curriculum-section" className="py-20 bg-muted/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">اختر منهجك التعليمي</h2>
            <p className="text-muted-foreground">نقدم لك مناهج تعليمية متخصصة تناسب احتياجاتك</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Arabic Curriculum Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card rounded-2xl overflow-hidden border shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative h-64 bg-gradient-to-br from-green-600 to-green-800">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <BookOpen className="h-16 w-16 text-white/80" />
                  <h3 className="text-3xl font-bold text-white">المنهج العربي</h3>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-4">المنهج العربي</h4>
                <ul className="space-y-3 mb-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>من الصف الرابع الابتدائي إلى المرحلة الثانوية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>مناهج معتمدة من وزارة التعليم</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>مواد دراسية شاملة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>تقييمات دورية ومتابعة مستمرة</span>
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full bg-brand hover:bg-brand/90 text-white"
                >
                  <Link href="/sign-up?curriculum=عربي">
                    ابدأ مع المنهج العربي
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Languages Curriculum Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-card rounded-2xl overflow-hidden border shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative h-64 bg-gradient-to-br from-red-600 to-red-800">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <BookOpen className="h-16 w-16 text-white/80" />
                  <h3 className="text-3xl font-bold text-white">منهج اللغات</h3>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-4">منهج اللغات</h4>
                <ul className="space-y-3 mb-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>من الصف الرابع الابتدائي إلى المرحلة الثانوية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>مناهج معتمدة من وزارة التعليم</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>مواد دراسية شاملة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>تقييمات دورية ومتابعة مستمرة</span>
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full bg-brand hover:bg-brand/90 text-white"
                >
                  <Link href="/sign-up?curriculum=لغات">
                    ابدأ مع منهج اللغات
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">آراء الطلاب</h2>
            <p className="text-muted-foreground">ماذا يقول طلابنا عن تجربتهم معنا</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "عصام اسامة",
                grade: "الصف الأول الثانوي",
                testimonial: "تجربة رائعة مع الاكاديمية، شرح مميز وطريقة سهلة في توصيل المعلومة"
              },
              {
                name: "سيف طارق",
                grade: "الصف الثاني الثانوي",
                testimonial: "المنهج منظم جداً والشرح واضح، ساعدني في فهم المواد بشكل أفضل"
              },
              {
                name: "عمر جمال",
                grade: "الصف الأول الثانوي",
                testimonial: "أفضل منصة تعليمية استخدمتها، المحتوى غني والشرح مبسط"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src="/male.png"
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mr-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.grade}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">مميزات المنصة</h2>
            <p className="text-muted-foreground">اكتشف ما يجعل منصتنا مميزة</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">جودة عالية</h3>
              <p className="text-muted-foreground">أفضل اكاديمية متخصصة</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">مجتمع نشط</h3>
              <p className="text-muted-foreground">انضم إلى مجتمع من الطلاب النشطين والمتفوقين والأوائل</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">شهادات تقدير</h3>
              <p className="text-muted-foreground">احصل على شهادات تقدير عند إكمال الكورسات</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلة التعلم معنا</h2>
            <p className="text-muted-foreground mb-8">
              انضم إلينا اليوم وابدأ رحلة النجاح
            </p>
            <Button size="lg" asChild className="bg-brand hover:bg-brand/90 text-white">
              <Link href="/sign-up">
                سجل الآن <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 