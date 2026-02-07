import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import '../core/config.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  bool _isLoading = false;
  String? _statusMessage;
  bool _isSuccess = false;

  Future<void> _handleClockIn() async {
    setState(() {
      _isLoading = true;
      _statusMessage = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;

      if (token == null) {
        throw Exception("Not authenticated");
      }

      // MOCK Location Data (In real app, use geolocator package)
      // final mockLocation = {
      //   "latitude": -6.200000,
      //   "longitude": 106.816666,
      // };

      // TODO: Implement actual API call once backend is reachable from emulator
      // For now, we simulate a successful API call
      // final response = await http.post(
      //   Uri.parse('${AppConfig.apiBaseUrl}/hr/attendance/clock-in'),
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer $token',
      //   },
      //   body: jsonEncode({
      //     "latitude": mockLocation['latitude'],
      //     "longitude": mockLocation['longitude'],
      //     "device_id": "emulator-123",
      //     "image_url": "https://placehold.co/600x400/png" // Mock image
      //   }),
      // );
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // if (response.statusCode == 201) {
        setState(() {
          _isSuccess = true;
          _statusMessage = "Clock In Successful at ${DateTime.now().toLocal()}";
        });
      // } else {
      //   throw Exception("Failed to clock in");
      // }

    } catch (e) {
      setState(() {
        _isSuccess = false;
        _statusMessage = "Error: $e";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(
              Icons.access_time_filled,
              size: 100,
              color: Colors.indigo,
            ),
            const SizedBox(height: 48),
            Text(
              "Good Morning, User!", // Ideally fetch name
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              "Please clock in to start your shift.",
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
            ),
            const SizedBox(height: 48),
            if (_statusMessage != null)
              Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: _isSuccess ? Colors.green.shade50 : Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _isSuccess ? Colors.green.shade200 : Colors.red.shade200),
                ),
                child: Text(
                  _statusMessage!,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: _isSuccess ? Colors.green.shade700 : Colors.red.shade700,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ElevatedButton.icon(
              onPressed: _isLoading ? null : _handleClockIn,
              icon: _isLoading 
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) 
                : const Icon(Icons.fingerprint),
              label: Text(_isLoading ? "Processing..." : "CLOCK IN NOW"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
