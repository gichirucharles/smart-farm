import { AppLogo } from "@/components/layout/app-logo"

export function WelcomeBanner() {
  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <AppLogo position="center" size="large" showText={true} showTagline={true} />
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to ShuleVerse</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-6 font-light">A Universe of Learning</p>
        <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
          Empowering education through innovative technology. Connect schools, teachers, students, and parents in one
          comprehensive platform designed for the modern educational experience.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-[#F0B323] mb-2">500+</div>
            <div className="text-white/80 text-sm">Schools Connected</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-[#F0B323] mb-2">50K+</div>
            <div className="text-white/80 text-sm">Students Enrolled</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-[#F0B323] mb-2">2K+</div>
            <div className="text-white/80 text-sm">Teachers Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}
