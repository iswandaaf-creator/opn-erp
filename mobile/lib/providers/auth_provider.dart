import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  String? _token;
  String? _tenantId;
  Map<String, dynamic>? _user;
  bool _isLoading = false;

  bool get isAuthenticated => _token != null;
  bool get isLoading => _isLoading;
  String? get token => _token;
  String? get tenantId => _tenantId; // e.g., 'pt_maju_jaya'
  Map<String, dynamic>? get user => _user;

  Future<void> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      // TODO: Connect to real backend
      // final response = await http.post(
      //   Uri.parse('${AppConfig.apiBaseUrl}/auth/login'),
      //   body: {'username': username, 'password': password},
      // );
       
      // Mock Login
      await Future.delayed(Duration(seconds: 1)); // Simulate network
      
      if (username == 'admin' && password == 'admin') {
         _token = 'mock_jwt_token_mobile';
         _tenantId = 'pt_demo_mobile';
         _user = {'username': 'admin', 'role': 'SUPER_ADMIN'};
         
         final prefs = await SharedPreferences.getInstance();
         await prefs.setString('token', _token!);
         await prefs.setString('tenantId', _tenantId!);
      } else {
        throw Exception('Invalid credentials');
      }

    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _token = null;
    _tenantId = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    notifyListeners();
  }

  Future<void> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey('token')) return;
    
    _token = prefs.getString('token');
    _tenantId = prefs.getString('tenantId');
    notifyListeners();
  }
}
