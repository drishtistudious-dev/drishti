import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Drishti Studio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0E0E0E),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).copyWith(
          bodyMedium: GoogleFonts.outfit(color: const Color(0xFFE2E2E2)),
        ),
      ),
      home: const OnboardingPage(),
    );
  }
}

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key});

  Future<void> _launchWebsite() async {
    final Uri url = Uri.parse('https://www.drishtistudios.in');
    try {
      if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
        debugPrint('Could not launch $url');
      }
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 1. High-Performance Zooming Background Image
          const Positioned.fill(
            child: ZoomingBackground(),
          ),
          
          // 2. Glass Overlay Gradient (bottom dark fade)
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black26,
                    Color(0xCC0E0E0E),
                    Color(0xFF0E0E0E),
                  ],
                  stops: [0.0, 0.60, 1.0],
                ),
              ),
            ),
          ),
          
          // 3. Main UI Content Layer
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top App Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Logo + Brand Title
                      Expanded(
                        child: Row(
                          children: [
                            Image.asset('assets/images/drishti_logo.png', height: 32, width: 32, fit: BoxFit.contain),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'DRISHTI STUDIO',
                                style: GoogleFonts.outfit(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: -0.5,
                                  color: const Color(0xFFF2CA50),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Web Link Icon Button
                      IconButton(
                        icon: const Icon(
                          Icons.language,
                          color: Color(0xFFD0C5AF),
                        ),
                        hoverColor: const Color(0xFFF2CA50).withOpacity(0.1),
                        tooltip: 'Visit Website',
                        onPressed: _launchWebsite,
                      ),
                    ],
                  ),
                ),
                
                const Spacer(),
                
                // Bottom Content Onboarding UI
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Chips Row removed
                      
                      // Heading
                      RichText(
                        text: TextSpan(
                          style: GoogleFonts.outfit(
                            fontSize: 38,
                            fontWeight: FontWeight.bold,
                            height: 1.15,
                            color: Colors.white,
                          ),
                          children: const [
                            TextSpan(text: 'Experience '),
                            TextSpan(
                              text: 'Visual Perfection',
                              style: TextStyle(
                                color: Color(0xFFF2CA50),
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      // Description
                      Text(
                        'Technical mastery meets creative vision. Crafting excellence through precision cinematography.',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          height: 1.5,
                          color: const Color(0xFFD0C5AF),
                        ),
                      ),
                      const SizedBox(height: 36),
                      
                      // CTA Button
                      Material(
                        color: const Color(0xFFF2CA50),
                        borderRadius: BorderRadius.circular(8),
                        child: InkWell(
                          onTap: () {
                            Navigator.of(context).push(
                              PageRouteBuilder(
                                pageBuilder: (context, animation, secondaryAnimation) => const DashboardPage(),
                                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                                  return FadeTransition(
                                    opacity: animation,
                                    child: child,
                                  );
                                },
                                transitionDuration: const Duration(milliseconds: 400),
                              ),
                            );
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            height: 56,
                            alignment: Alignment.center,
                            child: Text(
                              'GET STARTED',
                              style: GoogleFonts.outfit(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 2.5,
                                color: const Color(0xFF3C2F00),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Divider & Professional Suite Accent
                      Row(
                        children: [
                          Expanded(
                            child: Divider(
                              color: const Color(0xFF4D4635).withOpacity(0.3),
                              thickness: 1,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12.0),
                            child: Text(
                              'PROFESSIONAL SUITE',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                letterSpacing: 2.5,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFFD0C5AF).withOpacity(0.4),
                              ),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              color: const Color(0xFF4D4635).withOpacity(0.3),
                              thickness: 1,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChip(String label) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF353535).withOpacity(0.6),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(
          color: Colors.white.withOpacity(0.05),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          fontSize: 10,
          fontWeight: FontWeight.w500,
          letterSpacing: 1.5,
          color: Colors.white,
        ),
      ),
    );
  }
}

// Zooming Background Widget
class ZoomingBackground extends StatefulWidget {
  const ZoomingBackground({super.key});

  @override
  State<ZoomingBackground> createState() => _ZoomingBackgroundState();
}

class _ZoomingBackgroundState extends State<ZoomingBackground> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.scale(
          scale: _animation.value,
          child: child,
        );
      },
      child: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1D1B17),
              Color(0xFF0E0E0E),
              Color(0xFF13110E),
              Color(0xFF070707),
            ],
            stops: [0.0, 0.4, 0.7, 1.0],
          ),
          image: DecorationImage(
            image: AssetImage('assets/images/hero-bg.png'),
            fit: BoxFit.cover,
            opacity: 0.60,
          ),
        ),
        child: Opacity(
          opacity: 0.08,
          child: CustomPaint(
            painter: StudioGridPainter(),
          ),
        ),
      ),
    );
  }
}

class StudioGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFF2CA50)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    const int gridCount = 25;
    final double cellWidth = size.width / gridCount;
    final double cellHeight = size.height / gridCount;

    for (int i = 0; i <= gridCount; i++) {
      canvas.drawLine(Offset(i * cellWidth, 0), Offset(i * cellWidth, size.height), paint);
      canvas.drawLine(Offset(0, i * cellHeight), Offset(size.width, i * cellHeight), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Highly Optimized Pulsing Dot Widget
class PulsingDot extends StatefulWidget {
  const PulsingDot({super.key});

  @override
  State<PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<PulsingDot> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: const Color(0xFFF2CA50),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFF2CA50).withOpacity(0.8),
              blurRadius: 8,
              spreadRadius: 2,
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// Dashboard Page Implementation
// ==========================================
class GalleryProject {
  final String title;
  final String category;
  final String subtitle;
  final String description;
  final String imageUrl;
  final List<String> tags;

  const GalleryProject({
    required this.title,
    required this.category,
    required this.subtitle,
    required this.description,
    required this.imageUrl,
    required this.tags,
  });
}

const List<GalleryProject> _projects = [
  GalleryProject(
    title: 'The Neon Silence',
    category: 'NARRATIVE',
    subtitle: 'Narrative Short',
    description: 'An experimental short exploring urban isolation through low-light cinematography.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsQeWb6mw2RhoGL-YvB3_B5vALEgl9JML8dJHuFhOD_7ThQ4hG7BD_csD3QsjQs74dwKQXv6AG_v2za9edmy--p1rRn7QE-U8gwNllFz-ztFc3j_-y97ujqBkMsDoPwtzTBvJDCZxXFF4x-5kvCHyo2XV5qx7u7o4oXdvkm8vu_McwNWrlmc-kSJBEF1A1PirEKOI2rjOTRB0zhjh6q8eB7JbWt79OpcYpp8r9jgRtWGbsjB6jK7EkBPHfmp0TXq_Hr3o7QWfJEw',
    tags: ['8K RAW', '60 FPS'],
  ),
  GalleryProject(
    title: 'Optic Flow',
    category: 'COMMERCIAL',
    subtitle: 'Macro Visuals',
    description: 'A tight, intimate cinematic close-up of a vintage camera lens reflecting a soft, golden-hour light.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHuTXXnWUtdX2w9QGB6DGpZpIDqqGFIG7zXExSWtYD2se4Bbwn8Tx9BeINjSEW6GK3bKkFX54kcOYH0ohqQGbHIM9W9tT6dLNt5G1v4U7NkMnlXkFDKhLXqK4xZDIldF1Akz7nD3tEV6VAlWTZ1Zxk1lWgo8y3E7gJu_FHAHdy6v3Au9yXezWCaLLCQC-DpA9TpKDxzZbJDlhIMFydttacvxrHxMfZFnaoSHoN09KobvpmBlJo2sjyVX7_LyOUeTBp6eXMDKA3yw',
    tags: ['MACRO'],
  ),
  GalleryProject(
    title: 'Shadow Play',
    category: 'NARRATIVE',
    subtitle: 'Noir Series',
    description: 'A professional film set during a night shoot, featuring a single high-contrast spotlight cutting through a thick haze of atmospheric smoke.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIiQoPJ5s5E9R1DIqSS2LVzKkx1n1a9mY5OcJV0nxvgpBgow1WORCBwN2nqLDXUjxU-R8_wDPsSns_d_hiB_O3EQC5w2cwDWTS28pKhxP1ifB_Ij1VxcWPjb1DhcZqg94hcoPUmNiROZERGQVCZEe5LUJQ98IQM2jHyGhlO6fbhXQYcQKRAuc87e7Inkaf1B40VgsT3_IJBG1qVVDmt9fyZNwTgXqeAozxtjCMJrSWaU0a1-li3O529beyDBDQxVdrBElwWAE1qw',
    tags: ['NOIR'],
  ),
  GalleryProject(
    title: 'Chroma Theory',
    category: 'COMMERCIAL',
    subtitle: 'Color Grading',
    description: 'Masterclass in professional color grading workflows.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ86vwxnzYnsGbCLyTP3SuOxnE4wdw3j16cEJvXK40Yk8cbGBYMcUgxRZ-VTMsaDoRHhP0BjwZbnVt4JVi4rB667U-MxFwjIMh4voB4h6Wv8sv4UX97x_iXe0LtjDVmnR8AH1iHsiQ9_q9Lw_9T_t5UiVopFWIHOxyzG5WNLu7RU6EQRjDmJ3o7ZbvzekL5-uNbQ5ey22xfiicA-MP-7eC7L42pgMgdsQiEC0tqiy2kTIJTbbILUTBzYEwmg515ouBUxr-XXhz7g',
    tags: ['CHROMA'],
  ),
  GalleryProject(
    title: 'The Kit',
    category: 'DOCUMENTARY',
    subtitle: 'Gear Aesthetics',
    description: 'A top-down, flat-lay composition of high-end cinematic equipment.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2_A-07aElpxAZzFukBnbghsU61wybB5Vedfb5l74_fq9H3ZtfI6J0_svlBc-7nNo8O9iuOQflQ4ayKdskUOCCy--zWhgr1aZ7CgDd4NJesskMsVG6A5VU_3II1ryRxtSfO02Bqdcl9wJCXqHan2xgM0cGPMLnxpViefkjyIEUf1qgqEWkq4EgEtyT81R0t5_FBgWlk0d6T0hsqWIPdPz8S0MEzafV18MCnIXTShldV-sJsUpo__vy1siP79fz5B3y0QaK0f1qew',
    tags: ['GEAR'],
  ),
  GalleryProject(
    title: 'Peak Zenith',
    category: 'DOCUMENTARY',
    subtitle: 'Nature LOG',
    description: 'A breathtaking cinematic aerial shot of jagged, snow-capped mountain peaks.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCljUQbCrlVmBqhRukPXhMQGnGDU0Q9qxJ_wA3Q43h127_P7hnVujm4ypY6Nwomm1zCbL5e8XWvHxUD69zDsUQuk2ydd5dg540AlgqFWqBjcDETWCSKbZ2x9Q7GxunlZzokOQZAqcSeovD1vDTnAN8O28nas_W1mRolTLEAPmVJBbY3bWH2w3mZnm2uiFrenIpYyMuauQxAWvayeoMiPst-_pT6CGsdreJef4jpnZ22sKGNEPUNfz4ZFRx3HPBsBU28DhhQEvHulw',
    tags: ['NATURE'],
  ),
];

class GalleryCardWrapper extends StatefulWidget {
  final Widget child;
  final VoidCallback onTap;

  const GalleryCardWrapper({
    super.key,
    required this.child,
    required this.onTap,
  });

  @override
  State<GalleryCardWrapper> createState() => _GalleryCardWrapperState();
}

class _GalleryCardWrapperState extends State<GalleryCardWrapper> {
  double _scale = 1.0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _scale = 0.98),
      onTapUp: (_) => setState(() => _scale = 1.0),
      onTapCancel: () => setState(() => _scale = 1.0),
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOut,
        transform: Matrix4.identity()..scale(_scale),
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1F1F1F).withOpacity(0.5),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFFF2CA50).withOpacity(0.1),
              width: 0.5,
            ),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: widget.child,
          ),
        ),
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _currentIndex = 1; // Default to Dashboard (Page 1)
  late final PageController _pageController;
  String _selectedCategory = 'ALL WORKS';

  // Book a Session form states
  String _selectedService = 'Photography';
  DateTime? _projectDate;
  final _detailsController = TextEditingController();
  final _guestNameController = TextEditingController();
  final _guestEmailController = TextEditingController();
  final _guestPhoneController = TextEditingController();
  String _bookingStatus = 'idle'; // 'idle', 'calculating', 'success'

  // Interactive Calendar and Date Blocking states
  List<DateTime> _blockedDates = [];
  bool _isLoadingBlockedDates = false;
  DateTime _calendarFocusedMonth = DateTime(2026, 6);
  DateTime _calendarSelectedDay = DateTime(2026, 6, 9);

  // Mock calendar bookings
  final Map<DateTime, List<Map<String, dynamic>>> _mockCalendarBookings = {};

  DateTime _getFirstAvailableDate() {
    DateTime date = DateTime.now();
    DateTime compareDate = DateTime(date.year, date.month, date.day);
    while (_blockedDates.contains(compareDate)) {
      date = date.add(const Duration(days: 1));
      compareDate = DateTime(date.year, date.month, date.day);
    }
    return date;
  }

  Future<void> _fetchBlockedDates() async {
    if (_isLoadingBlockedDates) return;
    setState(() {
      _isLoadingBlockedDates = true;
    });
    try {
      final response = await http.get(
        Uri.parse('https://client.drishtistudios.in/api/bookings?blocked=true'),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['bookings'] != null) {
          final List<dynamic> bookingsList = data['bookings'];
          final List<DateTime> dates = [];
          for (var b in bookingsList) {
            if (b['startDate'] != null) {
              final parsedDate = DateTime.parse(b['startDate']);
              dates.add(DateTime(parsedDate.year, parsedDate.month, parsedDate.day));
            }
          }
          setState(() {
            _blockedDates = dates;
          });
        }
      }
    } catch (e) {
      debugPrint('Error fetching blocked dates: $e');
    } finally {
      setState(() {
        _isLoadingBlockedDates = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 1);
    _fetchBlockedDates();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _detailsController.dispose();
    _guestNameController.dispose();
    _guestEmailController.dispose();
    _guestPhoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0E0E0E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF131313).withOpacity(0.8),
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Image.asset('assets/images/drishti_logo.png', height: 24, width: 24, fit: BoxFit.contain),
            const SizedBox(width: 8),
            Text(
              'DRISHTI STUDIO',
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
                color: const Color(0xFFF2CA50),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle, color: Color(0xFFC8C6C5), size: 28),
            onPressed: () async {
              final prefs = await SharedPreferences.getInstance();
              final String? userEmail = prefs.getString('user_email');
              final String? userName = prefs.getString('user_name');
              final String userRole = prefs.getString('user_role') ?? 'Client';
              
              if (!mounted) return;
              
              if (userEmail != null && userName != null) {
                Navigator.of(context).push(
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) => ClientPortalPage(
                      email: userEmail,
                      name: userName,
                      role: userRole,
                    ),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      return FadeTransition(opacity: animation, child: child);
                    },
                  ),
                );
              } else {
                Navigator.of(context).push(
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) => const ClientLoginPage(),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      return FadeTransition(opacity: animation, child: child);
                    },
                  ),
                );
              }
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        children: [
          _buildProjectGalleryPage(),
          _buildStudioDashboardPage(),
          _buildCameraPage(),
          _buildTimelinePage(),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildCategoryChip(String category) {
    final bool isSelected = _selectedCategory == category;
    return Material(
      color: isSelected ? const Color(0xFFF2CA50) : const Color(0xFF1F1F1F),
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedCategory = category;
          });
        },
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: isSelected
                ? null
                : Border.all(
                    color: const Color(0xFF4D4635).withOpacity(0.3),
                    width: 1,
                  ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            category,
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
              color: isSelected ? const Color(0xFF3C2F00) : const Color(0xFFD0C5AF),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGalleryFeaturedCard(GalleryProject project) {
    return GalleryCardWrapper(
      onTap: () {},
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.network(
                project.imageUrl,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Container(
                    color: const Color(0xFF131313),
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF2CA50)),
                      ),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1F1F1F)),
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Color(0x99131313),
                      Color(0xEE131313),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: project.tags.map((tag) {
                      final isYellow = tag == '8K RAW';
                      return Container(
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: isYellow ? const Color(0xFFF2CA50) : const Color(0xFF0E0E0E).withOpacity(0.8),
                          borderRadius: BorderRadius.circular(2),
                          border: isYellow
                              ? null
                              : Border.all(
                                  color: const Color(0xFFF2CA50).withOpacity(0.2),
                                  width: 0.5,
                                ),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        child: Text(
                          tag,
                          style: GoogleFonts.outfit(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: isYellow ? const Color(0xFF3C2F00) : const Color(0xFFF2CA50),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    project.title,
                    style: GoogleFonts.outfit(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFF2CA50),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    project.description,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      color: const Color(0xFFD0C5AF),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGalleryThreeFourCard(GalleryProject project) {
    return GalleryCardWrapper(
      onTap: () {},
      child: AspectRatio(
        aspectRatio: 3 / 4,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.network(
                project.imageUrl,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Container(
                    color: const Color(0xFF131313),
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF2CA50)),
                      ),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1F1F1F)),
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Color(0x99131313),
                      Color(0xEE131313),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 12,
              left: 12,
              right: 12,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    project.title.toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFF2CA50),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    project.subtitle,
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      color: const Color(0xFFD0C5AF).withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGalleryHorizontalCard(GalleryProject project) {
    return GalleryCardWrapper(
      onTap: () {},
      child: SizedBox(
        height: 192,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.network(
                project.imageUrl,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Container(
                    color: const Color(0xFF131313),
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF2CA50)),
                      ),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1F1F1F)),
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Color(0x99131313),
                      Color(0xEE131313),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    project.title,
                    style: GoogleFonts.outfit(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFF2CA50),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    project.description,
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      color: const Color(0xFFD0C5AF),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGallerySquareCard(GalleryProject project) {
    return GalleryCardWrapper(
      onTap: () {},
      child: AspectRatio(
        aspectRatio: 1 / 1,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.network(
                project.imageUrl,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Container(
                    color: const Color(0xFF131313),
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF2CA50)),
                      ),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1F1F1F)),
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Color(0x99131313),
                      Color(0xEE131313),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 12,
              left: 12,
              right: 12,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    project.title.toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFF2CA50),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    project.subtitle,
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      color: const Color(0xFFD0C5AF).withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGalleryGrid(List<GalleryProject> filtered) {
    final List<Widget> children = [];

    final featuredIndex = filtered.indexWhere((p) => p.title == 'The Neon Silence');
    if (featuredIndex != -1) {
      children.add(_buildGalleryFeaturedCard(filtered[featuredIndex]));
      children.add(const SizedBox(height: 24));
    }

    final threeFourCards = filtered.where((p) => p.title == 'Optic Flow' || p.title == 'Shadow Play').toList();
    if (threeFourCards.isNotEmpty) {
      if (threeFourCards.length == 2) {
        children.add(Row(
          children: [
            Expanded(child: _buildGalleryThreeFourCard(threeFourCards[0])),
            const SizedBox(width: 16),
            Expanded(child: _buildGalleryThreeFourCard(threeFourCards[1])),
          ],
        ));
      } else {
        children.add(Row(
          children: [
            Expanded(child: _buildGalleryThreeFourCard(threeFourCards[0])),
            const SizedBox(width: 16),
            const Spacer(),
          ],
        ));
      }
      children.add(const SizedBox(height: 24));
    }

    final horizontalIndex = filtered.indexWhere((p) => p.title == 'Chroma Theory');
    if (horizontalIndex != -1) {
      children.add(_buildGalleryHorizontalCard(filtered[horizontalIndex]));
      children.add(const SizedBox(height: 24));
    }

    final squareCards = filtered.where((p) => p.title == 'The Kit' || p.title == 'Peak Zenith').toList();
    if (squareCards.isNotEmpty) {
      if (squareCards.length == 2) {
        children.add(Row(
          children: [
            Expanded(child: _buildGallerySquareCard(squareCards[0])),
            const SizedBox(width: 16),
            Expanded(child: _buildGallerySquareCard(squareCards[1])),
          ],
        ));
      } else {
        children.add(Row(
          children: [
            Expanded(child: _buildGallerySquareCard(squareCards[0])),
            const SizedBox(width: 16),
            const Spacer(),
          ],
        ));
      }
      children.add(const SizedBox(height: 24));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: children,
    );
  }

  Widget _buildProjectGalleryPage() {
    final filtered = _projects.where((p) => _selectedCategory == 'ALL WORKS' || p.category == _selectedCategory).toList();

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF2CA50),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'STUDIO PROJECTS',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    letterSpacing: 2.0,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFF2CA50),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Cinematic Portfolio',
              style: GoogleFonts.outfit(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: [
                  _buildCategoryChip('ALL WORKS'),
                  const SizedBox(width: 8),
                  _buildCategoryChip('NARRATIVE'),
                  const SizedBox(width: 8),
                  _buildCategoryChip('COMMERCIAL'),
                  const SizedBox(width: 8),
                  _buildCategoryChip('DOCUMENTARY'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            _buildGalleryGrid(filtered),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildStudioDashboardPage() {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'STUDIO DASHBOARD',
              style: GoogleFonts.outfit(
                fontSize: 12,
                letterSpacing: 2.0,
                fontWeight: FontWeight.bold,
                color: const Color(0xFFF2CA50),
              ),
            ),
            const SizedBox(height: 8),
            RichText(
              text: TextSpan(
                style: GoogleFonts.outfit(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  height: 1.2,
                  color: Colors.white,
                ),
                children: const [
                  TextSpan(text: 'Keen Insight.\n'),
                  TextSpan(
                    text: 'Technical Precision.',
                    style: TextStyle(color: Color(0xFFD0C5AF)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: _buildGlassPanel('ACTIVE PROJECTS', '--'),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildGlassPanel('EQUIPMENT OUT', '--'),
                ),
              ],
            ),
            const SizedBox(height: 36),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'Recent Projects',
                  style: GoogleFonts.outfit(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                InkWell(
                  onTap: () {},
                  child: Row(
                    children: [
                      Text(
                        'View All',
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFFF2CA50),
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Icon(
                        Icons.chevron_right,
                        color: Color(0xFFF2CA50),
                        size: 14,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildFeaturedCard(),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildBentoCard(
                    Icons.camera_roll,
                    'EQUIPMENT LOG',
                    'ARRI Alexa Mini MF setup ready for pickup.',
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildBentoCard(
                    Icons.palette,
                    'GRADING QUEUE',
                    '3 sequences pending LUT verification.',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 36),
            Text(
              'STUDIO TIMELINE',
              style: GoogleFonts.outfit(
                fontSize: 12,
                letterSpacing: 2.0,
                fontWeight: FontWeight.bold,
                color: const Color(0xFFD0C5AF).withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 16),
            _buildEmptyTimeline(),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitButton(String? email, String? name) {
    if (_bookingStatus == 'calculating') {
      return Container(
        height: 52,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: const Color(0xFFF2CA50).withOpacity(0.5),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          'CALCULATING...',
          style: GoogleFonts.outfit(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 2.0,
            color: const Color(0xFF3C2F00),
          ),
        ),
      );
    } else if (_bookingStatus == 'success') {
      return Container(
        height: 52,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: const Color(0xFF1F1F1F),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: const Color(0xFFF2CA50),
            width: 1,
          ),
        ),
        child: Text(
          'QUOTE REQUESTED',
          style: GoogleFonts.outfit(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 2.0,
            color: const Color(0xFFF2CA50),
          ),
        ),
      );
    } else {
      return Container(
        height: 52,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF2CA50),
              Color(0xFFD4AF37),
              Color(0xFFFFE088),
            ],
            stops: [0.0, 0.5, 1.0],
          ),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFD4AF37).withOpacity(0.3),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () async {
              if (_projectDate == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF1F1F1F),
                    content: Text(
                      'Please pick a project date first.',
                      style: GoogleFonts.outfit(color: const Color(0xFFF2CA50)),
                    ),
                  ),
                );
                return;
              }

              final emailInput = email ?? _guestEmailController.text.trim();
              final nameInput = name ?? _guestNameController.text.trim();
              final phoneInput = _guestPhoneController.text.trim();

              if (emailInput.isEmpty || nameInput.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF1F1F1F),
                    content: Text(
                      'Please fill in your name and email address.',
                      style: GoogleFonts.outfit(color: const Color(0xFFF2CA50)),
                    ),
                  ),
                );
                return;
              }

              // Simple Email Validation
              if (!emailInput.contains('@') || !emailInput.contains('.')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF1F1F1F),
                    content: Text(
                      'Please enter a valid email address.',
                      style: GoogleFonts.outfit(color: const Color(0xFFF2CA50)),
                    ),
                  ),
                );
                return;
              }

              setState(() {
                _bookingStatus = 'calculating';
              });

              try {
                final startDate = _projectDate!.toIso8601String();
                // Standard session duration is 4 hours
                final endDate = _projectDate!.add(const Duration(hours: 4)).toIso8601String();

                final response = await http.post(
                  Uri.parse('https://client.drishtistudios.in/api/bookings'),
                  headers: {'Content-Type': 'application/json'},
                  body: jsonEncode({
                    'email': emailInput,
                    'name': nameInput,
                    'phone': phoneInput.isEmpty ? null : phoneInput,
                    'type': _selectedService,
                    'startDate': startDate,
                    'endDate': endDate,
                    'equipmentNeeded': _detailsController.text.trim(),
                    'totalAmount': 0,
                    'advancePaid': 0,
                  }),
                );

                if (response.statusCode == 200) {
                  // Post successful, now trigger email client to drishtistudious@gmail.com
                  final String pickedDateString = '${_projectDate!.day}/${_projectDate!.month}/${_projectDate!.year}';
                  final String subject = 'New Quote Request: $_selectedService - $nameInput';
                  final String body = 'Hello Drishti Studios,\n\n'
                      'A new quote request has been submitted via the mobile app:\n\n'
                      'Client Details:\n'
                      '- Name: $nameInput\n'
                      '- Email: $emailInput\n'
                      '- Phone: ${phoneInput.isEmpty ? "Not Provided" : phoneInput}\n\n'
                      'Booking Details:\n'
                      '- Service: $_selectedService\n'
                      '- Date: $pickedDateString\n'
                      '- Requirements: ${_detailsController.text.trim()}\n\n'
                      'Sent via Drishti Studio App.';

                  final Uri emailUri = Uri(
                    scheme: 'mailto',
                    path: 'drishtistudious@gmail.com',
                    query: 'subject=${Uri.encodeComponent(subject)}&body=${Uri.encodeComponent(body)}',
                  );

                  try {
                    await launchUrl(emailUri, mode: LaunchMode.externalApplication);
                  } catch (e) {
                    debugPrint('Error launching mail client: $e');
                  }

                  setState(() {
                    _bookingStatus = 'success';
                  });
                  _detailsController.clear();
                  _guestNameController.clear();
                  _guestEmailController.clear();
                  _guestPhoneController.clear();
                  setState(() {
                    _projectDate = null;
                  });

                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF1F1F1F),
                        content: Text(
                          'Quote requested successfully! You will be updated through email.',
                          style: GoogleFonts.outfit(color: const Color(0xFFF2CA50)),
                        ),
                        duration: const Duration(seconds: 4),
                      ),
                    );
                  }
                  
                  Future.delayed(const Duration(seconds: 2), () {
                    if (mounted) {
                      setState(() {
                        _bookingStatus = 'idle';
                      });
                    }
                  });
                } else {
                  setState(() {
                    _bookingStatus = 'idle';
                  });
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF1F1F1F),
                        content: Text(
                          'Failed to request quote: Code ${response.statusCode}',
                          style: GoogleFonts.outfit(color: Colors.redAccent),
                        ),
                      ),
                    );
                  }
                }
              } catch (e) {
                setState(() {
                  _bookingStatus = 'idle';
                });
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      backgroundColor: const Color(0xFF1F1F1F),
                      content: Text(
                        'Network connection failed. Please try again.',
                        style: GoogleFonts.outfit(color: Colors.redAccent),
                      ),
                    ),
                  );
                }
              }
            },
            borderRadius: BorderRadius.circular(8),
            child: Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'REQUEST QUOTE',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2.0,
                      color: const Color(0xFF3C2F00),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(
                    Icons.arrow_forward,
                    color: Color(0xFF3C2F00),
                    size: 18,
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }
  }

  Widget _buildServiceCard(String serviceName, IconData icon) {
    final bool isSelected = _selectedService == serviceName;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedService = serviceName;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF2CA50).withOpacity(0.05) : const Color(0xFF1A1A1A).withOpacity(0.6),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? const Color(0xFFF2CA50) : const Color(0xFFFFFFFF).withOpacity(0.1),
            width: isSelected ? 1.0 : 0.5,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: isSelected ? const Color(0xFFF2CA50) : const Color(0xFFC8C6C5),
                  size: 20,
                ),
                const SizedBox(width: 12),
                Text(
                  serviceName,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    color: isSelected ? const Color(0xFFF2CA50) : const Color(0xFFE2E2E2),
                  ),
                ),
              ],
            ),
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? const Color(0xFFF2CA50) : const Color(0xFFFFFFFF).withOpacity(0.2),
                  width: 1,
                ),
              ),
              alignment: Alignment.center,
              child: isSelected
                  ? Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFFF2CA50),
                        shape: BoxShape.circle,
                      ),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCameraPage() {
    return FutureBuilder<SharedPreferences>(
      future: SharedPreferences.getInstance(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF2CA50)),
            ),
          );
        }
        final prefs = snapshot.data!;
        final String? email = prefs.getString('user_email');
        final String? name = prefs.getString('user_name');

        return _buildBookingFormView(email, name);
      },
    );
  }

  Widget _buildLoginRequiredView() {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 48.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(
              Icons.lock_outline,
              color: Color(0xFFF2CA50),
              size: 64,
            ),
            const SizedBox(height: 24),
            Text(
              'ACCESS REQUIRED',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: 2.0,
                color: const Color(0xFFF2CA50),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Please login to your Drishti Studio account to book sessions, request quotes, and manage your productions.',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 14,
                color: const Color(0xFFD0C5AF),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 36),
            Material(
              color: const Color(0xFFF2CA50),
              borderRadius: BorderRadius.circular(8),
              child: InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    PageRouteBuilder(
                      pageBuilder: (context, animation, secondaryAnimation) => const ClientLoginPage(),
                      transitionsBuilder: (context, animation, secondaryAnimation, child) {
                        return FadeTransition(opacity: animation, child: child);
                      },
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  height: 52,
                  alignment: Alignment.center,
                  child: Text(
                    'LOGIN TO PORTAL',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: const Color(0xFF3C2F00),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingFormView(String? email, String? name) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF2CA50),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'BOOK A SESSION',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    letterSpacing: 2.0,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFF2CA50),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Book a Session',
              style: GoogleFonts.outfit(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Define your creative vision. We’ll provide the precision.',
              style: GoogleFonts.outfit(
                fontSize: 14,
                color: const Color(0xFFD0C5AF).withOpacity(0.7),
              ),
            ),
            if (email == null || name == null) ...[
              const SizedBox(height: 24),
              Text(
                'YOUR CONTACT DETAILS',
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                  color: const Color(0xFF8A8278),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _guestNameController,
                style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFFE2E2E2)),
                decoration: InputDecoration(
                  labelText: 'Full Name *',
                  labelStyle: GoogleFonts.outfit(color: const Color(0xFF8A8278), fontSize: 12),
                  filled: true,
                  fillColor: const Color(0xFF111111),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _guestEmailController,
                keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFFE2E2E2)),
                decoration: InputDecoration(
                  labelText: 'Email Address *',
                  labelStyle: GoogleFonts.outfit(color: const Color(0xFF8A8278), fontSize: 12),
                  filled: true,
                  fillColor: const Color(0xFF111111),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _guestPhoneController,
                keyboardType: TextInputType.phone,
                style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFFE2E2E2)),
                decoration: InputDecoration(
                  labelText: 'Phone Number (Optional)',
                  labelStyle: GoogleFonts.outfit(color: const Color(0xFF8A8278), fontSize: 12),
                  filled: true,
                  fillColor: const Color(0xFF111111),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                  ),
                ),
              ),
            ] else ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF111111),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: const Color(0xFFF2CA50).withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.account_circle, color: Color(0xFFF2CA50), size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Booking as $name ($email)',
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: const Color(0xFFD0C5AF),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 36),
            Text(
              'SELECT SERVICE',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
                color: const Color(0xFF8A8278),
              ),
            ),
            const SizedBox(height: 12),
            _buildServiceCard('Photography', Icons.photo_camera),
            _buildServiceCard('Videography', Icons.videocam),
            _buildServiceCard('Event Coverage', Icons.event_available),
            _buildServiceCard('Studio Rental', Icons.apartment),
            _buildServiceCard('Equipment Rental', Icons.camera_roll),
            _buildServiceCard('Event Planning', Icons.assignment),
            _buildServiceCard('Creative Services', Icons.brush),
            _buildServiceCard('Corporate Services', Icons.business_center),
            const SizedBox(height: 24),
            Text(
              'PROJECT DATE',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
                color: const Color(0xFF8A8278),
              ),
            ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () async {
                final DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: _getFirstAvailableDate(),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                  selectableDayPredicate: (DateTime day) {
                    final compareDay = DateTime(day.year, day.month, day.day);
                    return !_blockedDates.contains(compareDay);
                  },
                  builder: (context, child) {
                    return Theme(
                      data: Theme.of(context).copyWith(
                        colorScheme: const ColorScheme.dark(
                          primary: Color(0xFFF2CA50),
                          onPrimary: Color(0xFF3C2F00),
                          surface: Color(0xFF131313),
                          onSurface: Color(0xFFE2E2E2),
                        ),
                        dialogBackgroundColor: const Color(0xFF131313),
                      ),
                      child: child!,
                    );
                  },
                );
                if (picked != null) {
                  setState(() {
                    _projectDate = picked;
                  });
                }
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: const BoxDecoration(
                  color: Color(0xFF111111),
                  border: Border(
                    bottom: BorderSide(
                      color: Colors.white10,
                      width: 1,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _projectDate == null
                          ? 'Select Project Date'
                          : '${_projectDate!.day}/${_projectDate!.month}/${_projectDate!.year}',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        color: _projectDate == null ? const Color(0xFF4A4238) : const Color(0xFFE2E2E2),
                      ),
                    ),
                    const Icon(
                      Icons.event,
                      color: Color(0xFFF2CA50),
                      size: 20,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'PROJECT DETAILS',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
                color: const Color(0xFF8A8278),
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _detailsController,
              maxLines: 4,
              style: GoogleFonts.outfit(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Describe the aesthetic, technical requirements, or mood board links...',
                hintStyle: GoogleFonts.outfit(color: const Color(0xFF4A4238), fontSize: 14),
                filled: true,
                fillColor: const Color(0xFF111111),
                contentPadding: const EdgeInsets.all(16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(4),
                  borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(4),
                  borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                ),
              ),
            ),
            const SizedBox(height: 24),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: SizedBox(
                height: 192,
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Opacity(
                        opacity: 0.4,
                        child: ColorFiltered(
                          colorFilter: const ColorFilter.matrix([
                            0.2126, 0.7152, 0.0722, 0, 0,
                            0.2126, 0.7152, 0.0722, 0, 0,
                            0.2126, 0.7152, 0.0722, 0, 0,
                            0,      0,      0,      1, 0,
                          ]),
                          child: Image.network(
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuAYCsIPds9HKxUZUjrB60JyuQzmqoWSiNLkJpwkgP-vRPLUMlEMjo8uuJp0Ep6h1LNwBNwc72g0v-wJZd4U3j21c-mvZopBw88mm5Cx6iyUdMdNDz2K_f5mtcDkGxGOClkI_0ihQxtY8HZ0J9Mb0gai95fnmikGoT0mp_-HMABObpoUBEjSMger4V1Wwf8IlRlSQVLuEybpfDElVT8mbS0GmELEiwhpcjRARyBa6ZHSbC9ba_HxkqTK9y66VRfD7sh3GTtu_f1glg',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1F1F1F)),
                          ),
                        ),
                      ),
                    ),
                    Positioned.fill(
                      child: Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              Color(0xFF0E0E0E),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 16,
                      left: 16,
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF2CA50),
                          borderRadius: BorderRadius.circular(2),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Text(
                          'VISUAL REFERENCE',
                          style: GoogleFonts.outfit(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                            color: const Color(0xFF3C2F00),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 36),
            _buildSubmitButton(email, name),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelinePage() {
    return RefreshIndicator(
      color: const Color(0xFFF2CA50),
      backgroundColor: const Color(0xFF131313),
      onRefresh: _fetchBlockedDates,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: Color(0xFFF2CA50),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'STUDIO SCHEDULE',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      letterSpacing: 2.0,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFF2CA50),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Studio Schedule',
                style: GoogleFonts.outfit(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'View booked dates and studio availability.',
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  color: const Color(0xFFD0C5AF).withOpacity(0.7),
                ),
              ),
              const SizedBox(height: 24),
              _buildInteractiveCalendar(),
              const SizedBox(height: 24),
              Text(
                'SCHEDULED SESSIONS',
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                  color: const Color(0xFF8A8278),
                ),
              ),
              const SizedBox(height: 12),
              _buildCalendarAgenda(),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInteractiveCalendar() {
    final List<String> weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    // Days in focused month
    int currentMonthDays = DateTime(_calendarFocusedMonth.year, _calendarFocusedMonth.month + 1, 0).day;
    int prevMonthDays = DateTime(_calendarFocusedMonth.year, _calendarFocusedMonth.month, 0).day;
    int offset = DateTime(_calendarFocusedMonth.year, _calendarFocusedMonth.month, 1).weekday % 7;

    List<Widget> dayCells = [];
    
    // 1. Previous month padding cells
    for (int i = offset - 1; i >= 0; i--) {
      int day = prevMonthDays - i;
      dayCells.add(_buildDayCell(day, isCurrentMonth: false));
    }
    
    // 2. Current month cells
    for (int i = 1; i <= currentMonthDays; i++) {
      dayCells.add(_buildDayCell(i, isCurrentMonth: true));
    }
    
    // 3. Next month padding cells
    int totalCells = dayCells.length;
    int cellsNeeded = totalCells <= 35 ? 35 : 42;
    int nextMonthDay = 1;
    while (dayCells.length < cellsNeeded) {
      dayCells.add(_buildDayCell(nextMonthDay, isCurrentMonth: false));
      nextMonthDay++;
    }

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131313),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white10, width: 0.5),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Month/Year header
          _buildCalendarHeader(),
          const SizedBox(height: 16),
          // Weekdays header row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: weekDays.map((d) {
              return SizedBox(
                width: 32,
                child: Text(
                  d,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFF2CA50).withOpacity(0.6),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),
          const Divider(color: Colors.white10, height: 1),
          const SizedBox(height: 8),
          // Grid
          GridView.count(
            crossAxisCount: 7,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 6,
            crossAxisSpacing: 6,
            children: dayCells,
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarHeader() {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    final String monthName = months[_calendarFocusedMonth.month - 1];
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          '$monthName ${_calendarFocusedMonth.year}',
          style: GoogleFonts.outfit(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.chevron_left, color: Color(0xFFF2CA50), size: 20),
              onPressed: () {
                setState(() {
                  _calendarFocusedMonth = DateTime(
                    _calendarFocusedMonth.year,
                    _calendarFocusedMonth.month - 1,
                  );
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.chevron_right, color: Color(0xFFF2CA50), size: 20),
              onPressed: () {
                setState(() {
                  _calendarFocusedMonth = DateTime(
                    _calendarFocusedMonth.year,
                    _calendarFocusedMonth.month + 1,
                  );
                });
              },
            ),
          ],
        )
      ],
    );
  }

  Widget _buildDayCell(int day, {required bool isCurrentMonth}) {
    if (!isCurrentMonth) {
      return Center(
        child: Text(
          day.toString(),
          style: GoogleFonts.outfit(
            fontSize: 13,
            color: Colors.white.withOpacity(0.15),
          ),
        ),
      );
    }

    final date = DateTime(_calendarFocusedMonth.year, _calendarFocusedMonth.month, day);
    final bool isSelected = _calendarSelectedDay.year == date.year &&
        _calendarSelectedDay.month == date.month &&
        _calendarSelectedDay.day == date.day;
        
    final now = DateTime.now();
    final bool isToday = now.year == date.year && now.month == date.month && now.day == date.day;
    
    // Check if the day is blocked/fully booked in our database/states
    final bool isBlocked = _blockedDates.contains(date);
    
    // Check if it has mock bookings
    final bool hasMockBookings = _mockCalendarBookings.containsKey(date);
    final bool hasEvent = isBlocked || hasMockBookings;

    BoxDecoration? decoration;
    TextStyle textStyle;

    if (isSelected) {
      decoration = BoxDecoration(
        color: const Color(0xFFF2CA50),
        borderRadius: BorderRadius.circular(4),
      );
      textStyle = GoogleFonts.outfit(
        fontSize: 13,
        fontWeight: FontWeight.bold,
        color: const Color(0xFF3C2F00),
      );
    } else if (isToday) {
      decoration = BoxDecoration(
        border: Border.all(color: const Color(0xFFF2CA50), width: 1.5),
        borderRadius: BorderRadius.circular(4),
      );
      textStyle = GoogleFonts.outfit(
        fontSize: 13,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      );
    } else if (isBlocked) {
      // Admin blocked/accepted date style
      decoration = BoxDecoration(
        color: const Color(0xFF331A1A),
        border: Border.all(color: const Color(0xFF802020), width: 0.5),
        borderRadius: BorderRadius.circular(4),
      );
      textStyle = GoogleFonts.outfit(
        fontSize: 13,
        fontWeight: FontWeight.w500,
        color: const Color(0xFFFF9999),
      );
    } else {
      textStyle = GoogleFonts.outfit(
        fontSize: 13,
        color: Colors.white.withOpacity(0.7),
      );
    }

    return InkWell(
      onTap: () {
        setState(() {
          _calendarSelectedDay = date;
        });
      },
      borderRadius: BorderRadius.circular(4),
      child: Container(
        decoration: decoration,
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              day.toString(),
              style: textStyle,
            ),
            if (hasEvent && !isSelected) ...[
              const SizedBox(height: 2),
              Container(
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  color: isBlocked ? const Color(0xFFFF4D4D) : const Color(0xFFF2CA50),
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCalendarAgenda() {
    final List<Map<String, dynamic>> dayEvents = [];

    // 1. Add mock events if they exist
    final mockEvents = _mockCalendarBookings[_calendarSelectedDay];
    if (mockEvents != null) {
      dayEvents.addAll(mockEvents);
    }

    // 2. Add blocked status if date is in _blockedDates
    final bool isBlocked = _blockedDates.contains(_calendarSelectedDay);
    if (isBlocked) {
      // Make sure we don't duplicate if it already has a matching mock event
      final hasBlockedLabel = dayEvents.any((e) => e['status'] == 'Blocked');
      if (!hasBlockedLabel) {
        dayEvents.add({
          'time': 'All Day',
          'title': 'Accepted Studio Event',
          'subtitle': 'Fully Booked (Accepted by Admin)',
          'type': 'Blocked Slot',
          'status': 'Blocked',
          'notes': 'This date has been confirmed and locked by the studio administration.'
        });
      }
    }

    if (dayEvents.isEmpty) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF131313),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.white10, width: 0.5),
        ),
        child: Column(
          children: [
            Text(
              'No studio sessions scheduled for this day.',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 13,
                color: const Color(0xFFD0C5AF).withOpacity(0.5),
              ),
            ),
            const SizedBox(height: 16),
            Material(
              color: const Color(0xFFF2CA50),
              borderRadius: BorderRadius.circular(4),
              child: InkWell(
                onTap: () {
                  // Navigate back to booking tab
                  _pageController.animateToPage(
                    2,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                },
                borderRadius: BorderRadius.circular(4),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: Text(
                    'BOOK A SESSION',
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                      color: const Color(0xFF3C2F00),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: dayEvents.map((event) {
        final String status = event['status'] ?? 'Pending';
        Color badgeColor = const Color(0xFFF2CA50);
        Color badgeTextColor = const Color(0xFF3C2F00);
        
        if (status == 'Confirmed') {
          badgeColor = const Color(0xFF334D1A);
          badgeTextColor = const Color(0xFFC2E2A2);
        } else if (status == 'Blocked') {
          badgeColor = const Color(0xFF4D1A1A);
          badgeTextColor = const Color(0xFFFF9999);
        }

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: const Color(0xFF131313),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: status == 'Blocked' 
                  ? const Color(0xFF802020).withOpacity(0.3)
                  : Colors.white10, 
              width: 0.5
            ),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1F1F1F),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: Colors.white10),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Text(
                      event['time'] ?? 'All Day',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFFF2CA50),
                      ),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: badgeColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    child: Text(
                      status.toUpperCase(),
                      style: GoogleFonts.outfit(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: badgeTextColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                event['title'] ?? '',
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              if (event['subtitle'] != null) ...[
                const SizedBox(height: 2),
                Text(
                  event['subtitle'] ?? '',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    color: const Color(0xFFD0C5AF).withOpacity(0.6),
                  ),
                ),
              ],
              const SizedBox(height: 12),
              const Divider(color: Colors.white10, height: 1),
              const SizedBox(height: 12),
              Text(
                event['notes'] ?? '',
                style: GoogleFonts.outfit(
                  fontSize: 13,
                  color: const Color(0xFFD0C5AF).withOpacity(0.8),
                  height: 1.4,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F).withOpacity(0.4),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white10),
      ),
      alignment: Alignment.center,
      child: Text(
        message,
        style: GoogleFonts.outfit(
          fontSize: 13,
          color: const Color(0xFFD0C5AF).withOpacity(0.6),
        ),
      ),
    );
  }

  Widget _buildGlassPanel(String label, String value) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F).withOpacity(0.6),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFF99907C).withOpacity(0.2),
          width: 0.5,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 10,
              letterSpacing: 1.0,
              fontWeight: FontWeight.w500,
              color: const Color(0xFFD0C5AF),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedCard() {
    return Container(
      height: 420,
      decoration: BoxDecoration(
        color: const Color(0xFF131313),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.white.withOpacity(0.05),
          width: 1,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Stack(
          children: [
            Positioned.fill(
              child: Opacity(
                opacity: 0.6,
                child: ColorFiltered(
                  colorFilter: const ColorFilter.matrix([
                    0.2126, 0.7152, 0.0722, 0, 0,
                    0.2126, 0.7152, 0.0722, 0, 0,
                    0.2126, 0.7152, 0.0722, 0, 0,
                    0,      0,      0,      1, 0,
                  ]),
                  child: Image.network(
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAepiQls8inY3ZLEEz-M8VzXD3w9cfR0h1Ttt5J9XkLZNDF65emejRIQ-AZZlnj9DFltI4H2ojKlbz37JYG231ypar50eQ-4wHOV8X-4s48JnBio8EF9mz6ju0nt38tpKi1x5DiHqNo6f96HhWsxGQc4PbxydxydnY3w5VkUnUMjaJVgzm2AdIC_2M0bRjkV1jmUSp7jvhDTApveNqWeD5fVMcEm3GkrQKxY-YPDDKQsKAPZQLDjh3Stjp7O6gxhqiJQY29pyhbnQ',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(color: const Color(0xFF1F1F1F));
                    },
                  ),
                ),
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Color(0xAA0E0E0E),
                      Color(0xFF0E0E0E),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 24,
              left: 24,
              right: 24,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _buildMiniChip('8K RAW'),
                      const SizedBox(width: 8),
                      _buildMiniChip('ANAMORPHIC'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'The Zenith Sequence',
                    style: GoogleFonts.outfit(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Commercial Cinematography • Color Grading',
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      color: const Color(0xFFD0C5AF),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Material(
                    color: const Color(0xFFF2CA50),
                    borderRadius: BorderRadius.circular(4),
                    child: InkWell(
                      onTap: () {},
                      borderRadius: BorderRadius.circular(4),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'OPEN PROJECT',
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF3C2F00),
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(
                              Icons.arrow_outward,
                              color: Color(0xFF3C2F00),
                              size: 14,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniChip(String label) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF353535).withOpacity(0.8),
        borderRadius: BorderRadius.circular(2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          fontSize: 9,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.0,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildBentoCard(IconData icon, String title, String desc) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F).withOpacity(0.6),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFF99907C).withOpacity(0.2),
          width: 0.5,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFFF2CA50), size: 24),
          const SizedBox(height: 12),
          Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            desc,
            style: GoogleFonts.outfit(
              fontSize: 11,
              color: const Color(0xFFD0C5AF),
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyTimeline() {
    return Container(
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(color: Colors.white10, width: 0.5),
          bottom: BorderSide(color: Colors.white10, width: 0.5),
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 36),
      alignment: Alignment.center,
      child: Text(
        'No upcoming timeline events.',
        style: GoogleFonts.outfit(
          fontSize: 14,
          color: const Color(0xFFD0C5AF).withOpacity(0.5),
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: const Color(0xFF131313).withOpacity(0.9),
        border: const Border(
          top: BorderSide(color: Colors.white10, width: 0.5),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.grid_view),
          _buildNavItem(1, Icons.dashboard),
          _buildNavItem(2, Icons.camera),
          _buildNavItem(3, Icons.event_note),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon) {
    final bool isActive = _currentIndex == index;
    return InkWell(
      onTap: () {
        _pageController.animateToPage(
          index,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isActive ? const Color(0xFFF2CA50) : const Color(0xFFC8C6C5).withOpacity(0.5),
            size: 24,
          ),
          if (isActive) ...[
            const SizedBox(height: 4),
            Container(
              width: 4,
              height: 4,
              decoration: const BoxDecoration(
                color: Color(0xFFF2CA50),
                shape: BoxShape.circle,
              ),
            ),
          ] else
            const SizedBox(height: 8),
        ],
      ),
    );
  }
}

// ==========================================
// Client LoginPage Component
// ==========================================
class ClientLoginPage extends StatefulWidget {
  const ClientLoginPage({super.key});

  @override
  State<ClientLoginPage> createState() => _ClientLoginPageState();
}

class _ClientLoginPageState extends State<ClientLoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() {
        _errorMessage = 'Email and password are required';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await http.post(
        Uri.parse('https://client.drishtistudios.in/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['user'] != null) {
        final user = data['user'];
        final String role = user['role'] ?? 'Client';
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_email', user['email'] ?? '');
        await prefs.setString('user_name', user['name'] ?? '');
        await prefs.setString('user_id', user['id'] ?? '');
        await prefs.setString('user_role', role);

        if (!mounted) return;
        
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => ClientPortalPage(
              email: user['email'] ?? '',
              name: user['name'] ?? '',
              role: role,
            ),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
          ),
        );
      } else {
        setState(() {
          _errorMessage = data['error'] ?? 'Incorrect credentials';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network connection failed';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _redirectToSignup() async {
    final Uri url = Uri.parse('https://client.drishtistudios.in/');
    try {
      if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
        debugPrint('Could not launch signup website $url');
      }
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0E0E0E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFFD0C5AF)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'ACCESS PORTAL',
          style: GoogleFonts.outfit(
            fontSize: 14,
            letterSpacing: 2.0,
            fontWeight: FontWeight.bold,
            color: const Color(0xFFF2CA50),
          ),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: const Color(0xFF131313).withOpacity(0.9),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.white.withOpacity(0.05),
                width: 0.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(
                  child: Image.asset(
                    'assets/images/drishti_logo.png',
                    height: 64,
                    fit: BoxFit.contain,
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: RichText(
                    text: TextSpan(
                      style: GoogleFonts.outfit(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.normal,
                      ),
                      children: const [
                        TextSpan(text: 'Drishti '),
                        TextSpan(
                          text: 'Studios',
                          style: TextStyle(color: Color(0xFFF2CA50), fontStyle: FontStyle.italic),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                
                Text(
                  'EMAIL ADDRESS',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: const Color(0xFF8A8278),
                  ),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: GoogleFonts.outfit(fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'you@example.com',
                    hintStyle: GoogleFonts.outfit(color: const Color(0xFF4A4238), fontSize: 14),
                    filled: true,
                    fillColor: const Color(0xFF111111),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                Text(
                  'PASSWORD',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: const Color(0xFF8A8278),
                  ),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  style: GoogleFonts.outfit(fontSize: 14),
                  decoration: InputDecoration(
                    hintText: '••••••••',
                    hintStyle: GoogleFonts.outfit(color: const Color(0xFF4A4238), fontSize: 14),
                    filled: true,
                    fillColor: const Color(0xFF111111),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                
                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.red.withOpacity(0.2)),
                    ),
                    child: Text(
                      _errorMessage!,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(color: Colors.redAccent, fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
                
                Material(
                  color: const Color(0xFFF2CA50),
                  borderRadius: BorderRadius.circular(8),
                  child: InkWell(
                    onTap: _isLoading ? null : _handleLogin,
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      height: 52,
                      alignment: Alignment.center,
                      child: _isLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF3C2F00)),
                              ),
                            )
                          : Text(
                              'ACCESS PORTAL',
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.8,
                                color: const Color(0xFF3C2F00),
                              ),
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                
                Center(
                  child: Text(
                    "New to Drishti Studios?",
                    style: GoogleFonts.outfit(color: const Color(0xFF6A6258), fontSize: 12),
                  ),
                ),
                const SizedBox(height: 4),
                TextButton(
                  onPressed: _redirectToSignup,
                  child: Text(
                    'Create Account on Website',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFFF2CA50),
                      fontWeight: FontWeight.bold,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// DYNAMIC: Client Bookings & Projects Portal (4-Tab View)
// ==========================================
class ClientPortalPage extends StatefulWidget {
  final String email;
  final String name;
  final String role;

  const ClientPortalPage({
    super.key,
    required this.email,
    required this.name,
    this.role = 'Client',
  });

  @override
  State<ClientPortalPage> createState() => _ClientPortalPageState();
}

class _ClientPortalPageState extends State<ClientPortalPage> {
  int _currentTab = 0;
  late Future<Map<String, dynamic>?> _portalDataFuture;

  @override
  void initState() {
    super.initState();
    _portalDataFuture = _fetchPortalData();
  }

  Future<Map<String, dynamic>?> _fetchPortalData() async {
    String url = 'https://client.drishtistudios.in/api/bookings?email=${widget.email}';
    if (widget.role.toLowerCase() == 'admin') {
      url = 'https://client.drishtistudios.in/api/bookings?all=true';
    } else if (widget.role.toLowerCase() == 'crew') {
      url = 'https://client.drishtistudios.in/api/bookings?staffEmail=${widget.email}';
    }

    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final bookings = data['bookings'] as List? ?? [];
      double totalOutstanding = 0.0;
      double totalPaid = 0.0;
      for (var b in bookings) {
        final amount = (b['totalAmount'] ?? 0.0) as num;
        final paid = (b['advancePaid'] ?? 0.0) as num;
        totalOutstanding += (amount - paid);
        totalPaid += paid;
      }
      data['totalOutstanding'] = totalOutstanding;
      data['totalPaid'] = totalPaid;
      return data;
    } else {
      throw Exception('Failed to load portal data');
    }
  }

  Future<void> _handleLogout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_email');
    await prefs.remove('user_name');
    await prefs.remove('user_id');
    await prefs.remove('user_role');

    if (!mounted) return;
    Navigator.of(context).pop(); // Go back to Dashboard
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF131313),
      appBar: AppBar(
        backgroundColor: const Color(0xFF131313),
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Image.asset('assets/images/drishti_logo.png', height: 24, width: 24, fit: BoxFit.contain),
            const SizedBox(width: 8),
            Text(
              'DRISHTI STUDIO',
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                letterSpacing: 2.0,
                color: const Color(0xFFF2CA50),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Color(0xFFC8C6C5)),
            onPressed: _handleLogout,
            tooltip: 'Sign Out',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          setState(() {
            _portalDataFuture = _fetchPortalData();
          });
          await _portalDataFuture;
        },
        color: const Color(0xFFF2CA50),
        backgroundColor: const Color(0xFF1F1F1F),
        child: FutureBuilder<Map<String, dynamic>?>(
          future: _portalDataFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF2CA50)),
                ),
              );
            } else if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, color: Colors.redAccent, size: 48),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to synchronize portal data.',
                        style: GoogleFonts.outfit(color: const Color(0xFFD0C5AF), fontSize: 16),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF2CA50),
                          foregroundColor: const Color(0xFF3C2F00),
                        ),
                        onPressed: () {
                          setState(() {
                            _portalDataFuture = _fetchPortalData();
                          });
                        },
                        child: const Text('RETRY'),
                      ),
                    ],
                  ),
                ),
              );
            }

            final data = snapshot.data;
            final List bookingsList = data?['bookings'] ?? [];
            final double totalOutstanding = data?['totalOutstanding'] ?? 0.0;

            if (widget.role.toLowerCase() == 'admin' || widget.role.toLowerCase() == 'crew') {
              switch (_currentTab) {
                case 0:
                  return widget.role.toLowerCase() == 'admin' 
                      ? _buildAdminDashboardTab(bookingsList)
                      : _buildCrewDashboardTab(bookingsList);
                case 1:
                  return _buildScheduleTab(bookingsList);
                case 2:
                  return _buildProfileTab();
                default:
                  return widget.role.toLowerCase() == 'admin' 
                      ? _buildAdminDashboardTab(bookingsList)
                      : _buildCrewDashboardTab(bookingsList);
              }
            } else {
              switch (_currentTab) {
                case 0:
                  return _buildDashboardTab(bookingsList);
                case 1:
                  return _buildScheduleTab(bookingsList);
                case 2:
                  return _buildFinancesTab(bookingsList, totalOutstanding);
                case 3:
                  return _buildProfileTab();
                default:
                  return _buildDashboardTab(bookingsList);
              }
            }
          },
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  // ==========================================
  // TAB 0: CLIENT DASHBOARD (PROJECTS OVERVIEW)
  // ==========================================
  Widget _buildDashboardTab(List bookings) {
    final hasBookings = bookings.isNotEmpty;
    dynamic nextBooking;
    if (hasBookings) {
      final now = DateTime.now();
      try {
        bookings.sort((a, b) {
          final da = DateTime.parse(a['startDate'] ?? '');
          final db = DateTime.parse(b['startDate'] ?? '');
          return da.compareTo(db);
        });
        nextBooking = bookings.firstWhere(
          (b) => DateTime.parse(b['startDate'] ?? '').isAfter(now),
          orElse: () => bookings.first,
        );
      } catch (_) {
        nextBooking = bookings.first;
      }
    }

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CLIENT DASHBOARD',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 2.0,
              color: const Color(0xFFF2CA50),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Welcome back, ${widget.name}.',
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Here is the overview of your creative journey with us.',
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: const Color(0xFFD0C5AF),
            ),
          ),
          const SizedBox(height: 24),

          Text(
            'UPCOMING SESSION',
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: const Color(0xFFD0C5AF).withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 12),
          _buildHeroNextShootCard(nextBooking),
          const SizedBox(height: 36),

          // Project Management Section Header with "+ NEW PROJECT" button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PROJECT MANAGEMENT',
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2.0,
                        color: const Color(0xFFD0C5AF).withOpacity(0.6),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Track your productions',
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        color: const Color(0xFF8A8278),
                      ),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF2CA50),
                  foregroundColor: const Color(0xFF3C2F00),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                onPressed: () async {
                  final Uri url = Uri.parse('https://client.drishtistudios.in/portal/bookings/new');
                  if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
                    debugPrint('Could not launch booking page');
                  }
                },
                child: Text(
                  'NEW PROJECT',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          if (!hasBookings) ...[
            _buildEmptyState('No active projects registered.'),
          ] else ...[
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: bookings.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final booking = bookings[index];
                final type = booking['type'] ?? 'Creative Shoot';
                final status = booking['status'] ?? 'Pending';
                final isCompleted = status.toString().toLowerCase() == 'completed' ||
                    status.toString().toLowerCase() == 'delivered';

                return Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F).withOpacity(0.6),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: const Color(0xFF99907C).withOpacity(0.2),
                      width: 0.5,
                    ),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Icon(
                            isCompleted ? Icons.video_camera_back : Icons.movie_filter,
                            color: isCompleted ? const Color(0xFFD0C5AF) : const Color(0xFFF2CA50),
                            size: 36,
                          ),
                          Container(
                            decoration: BoxDecoration(
                              color: isCompleted
                                  ? const Color(0xFF353535)
                                  : const Color(0xFFF2CA50).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(
                                color: isCompleted
                                    ? const Color(0xFF99907C).withOpacity(0.3)
                                    : const Color(0xFFF2CA50).withOpacity(0.3),
                                width: 0.5,
                              ),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            child: Text(
                              isCompleted ? 'DELIVERED' : 'ONGOING',
                              style: GoogleFonts.outfit(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                color: isCompleted ? const Color(0xFFD0C5AF) : const Color(0xFFF2CA50),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        type.toString().toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        isCompleted
                            ? 'Delivered Production Package'
                            : 'Cinematic Feature Film & Photography Package',
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          color: const Color(0xFFD0C5AF),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                isCompleted ? 'Fully Delivered' : 'In Production',
                                style: GoogleFonts.outfit(
                                  fontSize: 11,
                                  color: const Color(0xFF8A8278),
                                ),
                              ),
                              Text(
                                isCompleted ? '100%' : '65%',
                                style: GoogleFonts.outfit(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: isCompleted ? Colors.green : const Color(0xFFF2CA50),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(2),
                            child: LinearProgressIndicator(
                              value: isCompleted ? 1.0 : 0.65,
                              backgroundColor: Colors.white10,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                isCompleted ? Colors.green : const Color(0xFFF2CA50),
                              ),
                              minHeight: 3,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
          const SizedBox(height: 36),

          // Rating Feedback Section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF1F1F1F).withOpacity(0.4),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: const Color(0xFFF2CA50).withOpacity(0.1),
                width: 0.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Share Your Vision',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFF2CA50),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'How has your experience with Drishti Studio been so far? Your feedback shapes our lens.',
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    color: const Color(0xFFD0C5AF),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: List.generate(5, (index) {
                    final isFilled = index < 4;
                    return Icon(
                      Icons.star,
                      color: isFilled ? const Color(0xFFF2CA50) : Colors.white12,
                      size: 24,
                    );
                  }),
                ),
                const SizedBox(height: 16),
                TextField(
                  maxLines: 3,
                  style: GoogleFonts.outfit(fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Write your testimonial...',
                    hintStyle: GoogleFonts.outfit(color: const Color(0xFF4A4238)),
                    filled: true,
                    fillColor: const Color(0xFF0E0E0E),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(4),
                      borderSide: const BorderSide(color: Colors.white10),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(4),
                      borderSide: const BorderSide(color: Color(0xFFF2CA50)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Material(
                  color: const Color(0xFFF2CA50),
                  borderRadius: BorderRadius.circular(4),
                  child: InkWell(
                    onTap: () {},
                    borderRadius: BorderRadius.circular(4),
                    child: Container(
                      height: 48,
                      alignment: Alignment.center,
                      child: Text(
                        'SUBMIT TESTIMONIAL',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.5,
                          color: const Color(0xFF3C2F00),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 36),
        ],
      ),
    );
  }

  Widget _buildHeroNextShootCard(dynamic booking) {
    if (booking == null) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24.0),
        decoration: BoxDecoration(
          color: const Color(0xFF1F1F1F).withOpacity(0.4),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.white10),
        ),
        child: Column(
          children: [
            Icon(Icons.event_busy, color: const Color(0xFFD0C5AF).withOpacity(0.3), size: 40),
            const SizedBox(height: 16),
            Text(
              'No upcoming shoots scheduled.',
              style: GoogleFonts.outfit(color: const Color(0xFFD0C5AF), fontSize: 14),
            ),
          ],
        ),
      );
    }

    final type = booking['type'] ?? 'Creative Session';
    final dateStr = booking['startDate'] ?? '';
    String displayDate = '';
    try {
      final date = DateTime.parse(dateStr);
      displayDate = '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      displayDate = dateStr;
    }

    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFF99907C).withOpacity(0.2),
          width: 0.5,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Stack(
          children: [
            Positioned.fill(
              child: Opacity(
                opacity: 0.3,
                child: Image.network(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsVRcU020Xp7kyvhiXfxkJXjoZS9nuKvU4-4UcAtu9n1PSBWmCRdAPZA1w5kyJhiRj6jRV2SC2Neuvgz9-ExPXQ3SIJH0hgviUtCltT4B6Ip6XEkEnVmo6Ba_NLLJTkGLUSlq73XdaibtoDKy2uUAKMG65sFxaNVgM2gKfe6hS1KthoHH2XvCxuML_FdcaavhfS7qmDg8JEYD2sIR0aCaHx7SsP0vcVdazX6vPXSzVGGggwcni6SbNocxg6v8A93w_ngBUR2UxOA',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(),
                ),
              ),
            ),
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black87,
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF2CA50),
                      borderRadius: BorderRadius.circular(2),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Text(
                      'NEXT SHOOT',
                      style: GoogleFonts.outfit(
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                        color: const Color(0xFF3C2F00),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    type.toString().toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, color: Color(0xFFF2CA50), size: 14),
                      const SizedBox(width: 6),
                      Text(
                        displayDate,
                        style: GoogleFonts.outfit(color: const Color(0xFFE2E2E2), fontSize: 13),
                      ),
                      const SizedBox(width: 20),
                      const Icon(Icons.location_on, color: Color(0xFFF2CA50), size: 14),
                      const SizedBox(width: 6),
                      Text(
                        'Drishti Studio HQ',
                        style: GoogleFonts.outfit(color: const Color(0xFFE2E2E2), fontSize: 13),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // TAB 1: DYNAMIC SCHEDULE TIMELINE
  // ==========================================
  Widget _buildScheduleTab(List bookings) {
    if (bookings.isEmpty) {
      return SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Container(
          height: 300,
          alignment: Alignment.center,
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.event, color: const Color(0xFFD0C5AF).withOpacity(0.3), size: 48),
              const SizedBox(height: 16),
              Text(
                'No scheduled shoots.',
                style: GoogleFonts.outfit(color: const Color(0xFFD0C5AF), fontSize: 16),
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PROJECT SCHEDULE',
            style: GoogleFonts.outfit(
              fontSize: 12,
              letterSpacing: 2.0,
              fontWeight: FontWeight.bold,
              color: const Color(0xFFF2CA50),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Timeline details',
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 24),

          Container(
            padding: const EdgeInsets.only(left: 8),
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: bookings.length,
              itemBuilder: (context, index) {
                final booking = bookings[index];
                final type = booking['type'] ?? 'Session';
                final startStr = booking['startDate'] ?? '';
                final isLast = index == bookings.length - 1;

                String displayDate = '';
                try {
                  final date = DateTime.parse(startStr);
                  displayDate = '${date.day}/${date.month}/${date.year}';
                } catch (_) {
                  displayDate = startStr;
                }

                return IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF2CA50),
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFF131313), width: 2),
                            ),
                          ),
                          if (!isLast)
                            Expanded(
                              child: Container(
                                width: 1.5,
                                color: const Color(0xFF4D4635).withOpacity(0.5),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                displayDate.toUpperCase(),
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.5,
                                  color: const Color(0xFFF2CA50),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                type.toString().toUpperCase(),
                                style: GoogleFonts.outfit(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Cinematography feature session. Standard lighting setups active.',
                                style: GoogleFonts.outfit(
                                  fontSize: 12,
                                  color: const Color(0xFFD0C5AF),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: DYNAMIC FINANCES (₹ RUPEE FORMAT)
  // ==========================================
  Widget _buildFinancesTab(List bookings, double totalOutstanding) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'FINANCES OVERVIEW',
            style: GoogleFonts.outfit(
              fontSize: 12,
              letterSpacing: 2.0,
              fontWeight: FontWeight.bold,
              color: const Color(0xFFF2CA50),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Invoices & Payments',
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 24),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF1F1F1F),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: const Color(0xFF99907C).withOpacity(0.2),
                width: 0.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'TOTAL OUTSTANDING',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: const Color(0xFFD0C5AF),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '₹${totalOutstanding.toStringAsFixed(2)}',
                  style: GoogleFonts.outfit(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFF2CA50),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 36),

          Text(
            'DETAILED STATEMENTS',
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: const Color(0xFFD0C5AF).withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 16),

          if (bookings.isEmpty) ...[
            _buildEmptyState('No transactions found.'),
          ] else ...[
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: bookings.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final booking = bookings[index];
                final id = booking['id'] ?? '';
                final type = booking['type'] ?? 'Session';
                final total = (booking['totalAmount'] ?? 0.0) as num;
                final paid = (booking['advancePaid'] ?? 0.0) as num;
                final outstanding = total - paid;
                final isUnpaid = outstanding > 0;
                final displayId = id.toString().length > 8
                    ? id.toString().substring(0, 8).toUpperCase()
                    : '2024';

                return Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F).withOpacity(0.6),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: const Color(0xFF99907C).withOpacity(0.2),
                      width: 0.5,
                    ),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: isUnpaid
                              ? const Color(0xFFF2CA50).withOpacity(0.1)
                              : Colors.green.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isUnpaid ? Icons.receipt_long : Icons.check_circle,
                          color: isUnpaid ? const Color(0xFFF2CA50) : Colors.greenAccent,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'INV-2024-$displayId',
                              style: GoogleFonts.outfit(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '$type - Production Deposit',
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                color: const Color(0xFFD0C5AF),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '₹${total.toStringAsFixed(2)}',
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnpaid ? const Color(0xFFF2CA50) : Colors.white70,
                            ),
                          ),
                          const SizedBox(height: 4),
                          if (isUnpaid)
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFF2CA50),
                                foregroundColor: const Color(0xFF3C2F00),
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                              onPressed: () async {
                                final Uri url = Uri.parse('https://client.drishtistudios.in/portal');
                                if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
                                  debugPrint('Could not launch payment portal');
                                }
                              },
                              child: Text(
                                'PAY NOW',
                                style: GoogleFonts.outfit(
                                  fontSize: 8,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            )
                          else
                            Text(
                              'PAID',
                              style: GoogleFonts.outfit(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                color: Colors.greenAccent,
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ],
      ),
    );
  }

  // ==========================================
  // TAB 3: CLIENT PROFILE & SESSION SETTINGS
  // ==========================================
  Widget _buildProfileTab() {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const CircleAvatar(
            radius: 50,
            backgroundColor: Colors.white12,
            child: Icon(Icons.person, size: 50, color: Color(0xFFF2CA50)),
          ),
          const SizedBox(height: 24),
          Text(
            widget.name,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            widget.email,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(color: const Color(0xFFD0C5AF), fontSize: 14),
          ),
          const SizedBox(height: 12),
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFF2CA50).withOpacity(0.1),
                border: Border.all(color: const Color(0xFFF2CA50).withOpacity(0.3)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                widget.role.toUpperCase(),
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                  color: const Color(0xFFF2CA50),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Divider(color: Colors.white10),
          const SizedBox(height: 24),
          if (widget.role.toLowerCase() == 'admin') ...[
            ListTile(
              leading: const Icon(Icons.people, color: Color(0xFFF2CA50)),
              title: Text('Manage Staff & Crew', style: GoogleFonts.outfit()),
              subtitle: Text('Review schedules and active assignments.', style: GoogleFonts.outfit(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.business_center, color: Color(0xFFF2CA50)),
              title: Text('System Operations', style: GoogleFonts.outfit()),
              subtitle: Text('Monitor server integrations and backups.', style: GoogleFonts.outfit(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.analytics, color: Color(0xFFF2CA50)),
              title: Text('Booking Metrics', style: GoogleFonts.outfit()),
              subtitle: Text('View monthly performance metrics and analytics.', style: GoogleFonts.outfit(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
          ] else if (widget.role.toLowerCase() == 'crew') ...[
            ListTile(
              leading: const Icon(Icons.assignment, color: Color(0xFFF2CA50)),
              title: Text('Crew Protocols', style: GoogleFonts.outfit()),
              subtitle: Text('Review studio protocols and equipment handling rules.', style: GoogleFonts.outfit(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.support_agent, color: Color(0xFFF2CA50)),
              title: Text('Contact Coordinator', style: GoogleFonts.outfit()),
              subtitle: Text('Reach out to studio coordinators and managers.', style: GoogleFonts.outfit(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.settings, color: Color(0xFFC8C6C5)),
              title: Text('Account Settings', style: GoogleFonts.outfit()),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
          ] else ...[
            ListTile(
              leading: const Icon(Icons.movie_creation_outlined, color: Color(0xFFF2CA50)),
              title: Text('Concierge Support', style: GoogleFonts.outfit()),
              subtitle: Text('24/7 support active for members.', style: GoogleFonts.outfit(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.settings, color: Color(0xFFC8C6C5)),
              title: Text('Account Settings', style: GoogleFonts.outfit()),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
          ],
          const SizedBox(height: 48),
          Material(
            color: Colors.redAccent.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
            child: InkWell(
              onTap: _handleLogout,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                height: 52,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'SIGN OUT',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2.0,
                    color: Colors.redAccent,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F1F).withOpacity(0.4),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white10),
      ),
      alignment: Alignment.center,
      child: Text(
        message,
        style: GoogleFonts.outfit(
          fontSize: 13,
          color: const Color(0xFFD0C5AF).withOpacity(0.6),
        ),
      ),
    );
  }

  // ==========================================
  // PREMIUM BOTTOM NAVIGATION
  // ==========================================
  Widget _buildBottomNavBar() {
    final bool isAdminOrCrew = widget.role.toLowerCase() == 'admin' || widget.role.toLowerCase() == 'crew';
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: const Color(0xFF131313),
        border: const Border(
          top: BorderSide(color: Colors.white10, width: 0.5),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: isAdminOrCrew ? [
          _buildBottomNavItem(0, Icons.grid_view, 'Dashboard'),
          _buildBottomNavItem(1, Icons.calendar_today, 'Schedule'),
          _buildBottomNavItem(2, Icons.person, 'Profile'),
        ] : [
          _buildBottomNavItem(0, Icons.grid_view, 'Projects'),
          _buildBottomNavItem(1, Icons.calendar_today, 'Schedule'),
          _buildBottomNavItem(2, Icons.receipt_long, 'Finances'),
          _buildBottomNavItem(3, Icons.person, 'Profile'),
        ],
      ),
    );
  }

  Widget _buildBottomNavItem(int index, IconData icon, String label) {
    final bool isActive = _currentTab == index;
    return InkWell(
      onTap: () {
        setState(() {
          _currentTab = index;
        });
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isActive ? const Color(0xFFF2CA50) : const Color(0xFFC8C6C5).withOpacity(0.5),
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 9,
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              color: isActive ? const Color(0xFFF2CA50) : const Color(0xFFC8C6C5).withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _updateBookingStatus(String bookingId, String newStatus) async {
    setState(() {
      _portalDataFuture = Future.value(null);
    });
    try {
      final response = await http.put(
        Uri.parse('https://client.drishtistudios.in/api/bookings/$bookingId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'status': newStatus}),
      );
      if (response.statusCode == 200) {
        setState(() {
          _portalDataFuture = _fetchPortalData();
        });
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to update booking status')),
          );
        }
        setState(() {
          _portalDataFuture = _fetchPortalData();
        });
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Network error. Failed to update status')),
        );
      }
      setState(() {
        _portalDataFuture = _fetchPortalData();
      });
    }
  }

  Widget _buildAdminDashboardTab(List bookings) {
    final pending = bookings.where((b) => b['status'] == 'Pending').toList();
    final confirmed = bookings.where((b) => b['status'] == 'Confirmed').toList();
    final completed = bookings.where((b) => b['status'] == 'Completed').toList();

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'ADMIN DASHBOARD',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 2.0,
              color: const Color(0xFFF2CA50),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Welcome back, ${widget.name}.',
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Studio operations and requests manager.',
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: const Color(0xFFD0C5AF),
            ),
          ),
          const SizedBox(height: 24),

          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('PENDING', style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF8A8278), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${pending.length}', style: GoogleFonts.outfit(fontSize: 20, color: const Color(0xFFF2CA50), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('CONFIRMED', style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF8A8278), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${confirmed.length}', style: GoogleFonts.outfit(fontSize: 20, color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('COMPLETED', style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF8A8278), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${completed.length}', style: GoogleFonts.outfit(fontSize: 20, color: Colors.green, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          Text(
            'PENDING REQUESTS (${pending.length})',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: const Color(0xFFD0C5AF).withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 12),

          if (pending.isEmpty)
            _buildEmptyState('No pending shoot requests to confirm.')
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: pending.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final b = pending[index];
                final bId = b['id'] ?? '';
                final bType = b['type'] ?? 'Session';
                final dateStr = b['startDate'] ?? '';
                String displayDate = dateStr;
                try {
                  final parsed = DateTime.parse(dateStr);
                  displayDate = '${parsed.day}/${parsed.month}/${parsed.year}';
                } catch (_) {}

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C1C1C),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            bType.toString().toUpperCase(),
                            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          Text(
                            displayDate,
                            style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFFD0C5AF)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      if (b['customer'] != null) ...[
                        Text(
                          'Client: ${b['customer']['name'] ?? 'Unknown'}',
                          style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF8A8278)),
                        ),
                        Text(
                          'Email: ${b['customer']['email'] ?? ''}',
                          style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF8A8278)),
                        ),
                      ],
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF2CA50),
                              foregroundColor: const Color(0xFF3C2F00),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            onPressed: () => _updateBookingStatus(bId, 'Confirmed'),
                            icon: const Icon(Icons.check, size: 12),
                            label: Text('APPROVE', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
                          const SizedBox(width: 8),
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.redAccent,
                              side: const BorderSide(color: Colors.redAccent, width: 0.5),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            onPressed: () => _updateBookingStatus(bId, 'Cancelled'),
                            icon: const Icon(Icons.close, size: 12),
                            label: Text('DECLINE', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildCrewDashboardTab(List bookings) {
    final confirmed = bookings.where((b) => b['status'] == 'Confirmed').toList();
    final completed = bookings.where((b) => b['status'] == 'Completed').toList();

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CREW DASHBOARD',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 2.0,
              color: const Color(0xFFF2CA50),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Welcome back, ${widget.name}.',
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Your assigned productions and schedules.',
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: const Color(0xFFD0C5AF),
            ),
          ),
          const SizedBox(height: 24),

          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('ASSIGNMENTS', style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF8A8278), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${bookings.length}', style: GoogleFonts.outfit(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('UPCOMING', style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF8A8278), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${confirmed.length}', style: GoogleFonts.outfit(fontSize: 20, color: const Color(0xFFF2CA50), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F1F),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('COMPLETED', style: GoogleFonts.outfit(fontSize: 10, color: const Color(0xFF8A8278), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${completed.length}', style: GoogleFonts.outfit(fontSize: 20, color: Colors.greenAccent, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          Text(
            'MY ASSIGNED SHOOTS (${bookings.length})',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: const Color(0xFFD0C5AF).withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 12),

          if (bookings.isEmpty)
            _buildEmptyState('No assigned shoots at this time.')
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: bookings.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final b = bookings[index];
                final bType = b['type'] ?? 'Creative Shoot';
                final dateStr = b['startDate'] ?? '';
                String displayDate = dateStr;
                try {
                  final parsed = DateTime.parse(dateStr);
                  displayDate = '${parsed.day}/${parsed.month}/${parsed.year}';
                } catch (_) {}

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C1C1C),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            bType.toString().toUpperCase(),
                            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Shoot Date: $displayDate',
                            style: GoogleFonts.outfit(fontSize: 12, color: const Color(0xFF8A8278)),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: b['status'] == 'Completed' ? Colors.green.withOpacity(0.1) : const Color(0xFFF2CA50).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          b['status'].toString().toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: b['status'] == 'Completed' ? Colors.greenAccent : const Color(0xFFF2CA50),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
