// MMB Buyer App - Riverpod Providers & REST / MongoDB API Integration
// Place this file in your Flutter app (e.g. lib/data/buyer_providers.dart)
// Supports Authorization: Bearer <JWT_TOKEN>

import 'dart:async';
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

// Configuration
const String kApiBaseUrl = 'http://10.0.2.2:5000/api'; // Android Emulator, or your server IP

// ---------------------------------------------------------------------------
// HTTP Header Helper (Bearer Token Injection)
// ---------------------------------------------------------------------------
Map<String, String> _buildHeaders({String? token, bool isJson = true}) {
  final headers = <String, String>{};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token != null && token.isNotEmpty) {
    headers['Authorization'] = 'Bearer $token';
  }
  return headers;
}

// ---------------------------------------------------------------------------
// Domain Models
// ---------------------------------------------------------------------------
class BannerItem {
  final String id;
  final String title;
  final String? subtitle;
  final String imageUrl;
  final String? actionUrl;
  final int order;
  final bool active;

  BannerItem({
    required this.id,
    required this.title,
    this.subtitle,
    required this.imageUrl,
    this.actionUrl,
    required this.order,
    required this.active,
  });

  factory BannerItem.fromJson(Map<String, dynamic> json) => BannerItem(
        id: json['id'] ?? '',
        title: json['title'] ?? '',
        subtitle: json['subtitle'],
        imageUrl: json['imageUrl'] ?? '',
        actionUrl: json['actionUrl'],
        order: json['order'] ?? 0,
        active: json['active'] ?? true,
      );
}

class CartItem {
  final String productId;
  final String name;
  final double price;
  final int quantity;
  final String? image;
  final String? category;

  CartItem({
    required this.productId,
    required this.name,
    required this.price,
    required this.quantity,
    this.image,
    this.category,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        productId: json['productId'] ?? '',
        name: json['name'] ?? '',
        price: (json['price'] as num?)?.toDouble() ?? 0.0,
        quantity: json['quantity'] ?? 1,
        image: json['image'],
        category: json['category'],
      );

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'name': name,
        'price': price,
        'quantity': quantity,
        'image': image,
        'category': category,
      };
}

class Enquiry {
  final String id;
  final String buyerId;
  final String buyerName;
  final String? buyerPhone;
  final String productId;
  final String productName;
  final String? productImage;
  final String message;
  final double? offerPrice;
  final String status;
  final DateTime createdAt;

  Enquiry({
    required this.id,
    required this.buyerId,
    required this.buyerName,
    this.buyerPhone,
    required this.productId,
    required this.productName,
    this.productImage,
    required this.message,
    this.offerPrice,
    required this.status,
    required this.createdAt,
  });

  factory Enquiry.fromJson(Map<String, dynamic> json) => Enquiry(
        id: json['id'] ?? '',
        buyerId: json['buyerId'] ?? '',
        buyerName: json['buyerName'] ?? '',
        buyerPhone: json['buyerPhone'],
        productId: json['productId'] ?? '',
        productName: json['productName'] ?? '',
        productImage: json['productImage'],
        message: json['message'] ?? '',
        offerPrice: (json['offerPrice'] as num?)?.toDouble(),
        status: json['status'] ?? 'new',
        createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      );
}

// ---------------------------------------------------------------------------
// Auth Repository (JWT Authentication)
// ---------------------------------------------------------------------------
class AuthRepository {
  Future<Map<String, dynamic>> login(String emailOrPhone, String password) async {
    final res = await http.post(
      Uri.parse('$kApiBaseUrl/auth/login'),
      headers: _buildHeaders(),
      body: jsonEncode({
        'emailOrPhone': emailOrPhone,
        'password': password,
      }),
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body);
    }
    throw Exception(jsonDecode(res.body)['error'] ?? 'Login failed');
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String password,
    String? email,
    String? phone,
    String role = 'buyer',
    String? shopName,
    String? city,
  }) async {
    final res = await http.post(
      Uri.parse('$kApiBaseUrl/auth/register'),
      headers: _buildHeaders(),
      body: jsonEncode({
        'name': name,
        'password': password,
        'email': email,
        'phone': phone,
        'role': role,
        'shopName': shopName,
        'city': city,
      }),
    );

    if (res.statusCode == 201) {
      return jsonDecode(res.body);
    }
    throw Exception(jsonDecode(res.body)['error'] ?? 'Registration failed');
  }

  Future<Map<String, dynamic>> getProfile(String token) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/auth/me'),
      headers: _buildHeaders(token: token),
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body);
    }
    throw Exception('Failed to load profile');
  }
}

// ---------------------------------------------------------------------------
// Repositories
// ---------------------------------------------------------------------------
class CatalogRepository {
  Future<List<dynamic>> getApproved({String? token}) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/catalog/products'),
      headers: _buildHeaders(token: token),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('Failed to load approved products');
  }

  Stream<List<dynamic>> watchApproved({String? token}) async* {
    while (true) {
      try {
        yield await getApproved(token: token);
      } catch (_) {}
      await Future.delayed(const Duration(seconds: 10));
    }
  }

  Future<List<BannerItem>> getBanners({String? token}) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/catalog/banners'),
      headers: _buildHeaders(token: token),
    );
    if (res.statusCode == 200) {
      final List list = jsonDecode(res.body);
      return list.map((e) => BannerItem.fromJson(e)).toList();
    }
    throw Exception('Failed to load banners');
  }

  Stream<List<BannerItem>> watchBanners({String? token}) async* {
    while (true) {
      try {
        yield await getBanners(token: token);
      } catch (_) {}
      await Future.delayed(const Duration(seconds: 30));
    }
  }

  Future<List<String>> getCategories({String? token}) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/catalog/categories'),
      headers: _buildHeaders(token: token),
    );
    if (res.statusCode == 200) {
      return List<String>.from(jsonDecode(res.body));
    }
    throw Exception('Failed to load categories');
  }

  Stream<List<String>> watchCategories({String? token}) async* {
    while (true) {
      try {
        yield await getCategories(token: token);
      } catch (_) {}
      await Future.delayed(const Duration(seconds: 60));
    }
  }
}

class CartRepository {
  Future<List<CartItem>> getCart(String uid, {String? token}) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/cart?userId=$uid'),
      headers: _buildHeaders(token: token),
    );
    if (res.statusCode == 200) {
      final List list = jsonDecode(res.body);
      return list.map((e) => CartItem.fromJson(e)).toList();
    }
    return [];
  }

  Stream<List<CartItem>> watch(String uid, {String? token}) async* {
    while (true) {
      try {
        yield await getCart(uid, token: token);
      } catch (_) {}
      await Future.delayed(const Duration(seconds: 5));
    }
  }

  Future<void> upsert(String uid, CartItem item, {String? token}) async {
    await http.post(
      Uri.parse('$kApiBaseUrl/cart'),
      headers: _buildHeaders(token: token),
      body: jsonEncode({'userId': uid, ...item.toJson()}),
    );
  }

  Future<void> setQty(String uid, String productId, int qty, {String? token}) async {
    await http.put(
      Uri.parse('$kApiBaseUrl/cart/qty'),
      headers: _buildHeaders(token: token),
      body: jsonEncode({'userId': uid, 'productId': productId, 'quantity': qty}),
    );
  }

  Future<void> remove(String uid, String productId, {String? token}) async {
    await http.delete(
      Uri.parse('$kApiBaseUrl/cart/$productId?userId=$uid'),
      headers: _buildHeaders(token: token),
    );
  }

  Future<void> clear(String uid, {String? token}) async {
    await http.delete(
      Uri.parse('$kApiBaseUrl/cart?userId=$uid'),
      headers: _buildHeaders(token: token),
    );
  }
}

class FavoritesRepository {
  Future<Set<String>> getIds(String uid, {String? token}) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/favorites?userId=$uid'),
      headers: _buildHeaders(token: token),
    );
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return Set<String>.from(data['favoriteIds'] ?? []);
    }
    return {};
  }

  Stream<Set<String>> watchIds(String uid, {String? token}) async* {
    while (true) {
      try {
        yield await getIds(uid, token: token);
      } catch (_) {}
      await Future.delayed(const Duration(seconds: 5));
    }
  }

  Future<Set<String>> toggle(String uid, String productId, {String? token}) async {
    final res = await http.post(
      Uri.parse('$kApiBaseUrl/favorites/toggle'),
      headers: _buildHeaders(token: token),
      body: jsonEncode({'userId': uid, 'productId': productId}),
    );
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return Set<String>.from(data['favoriteIds'] ?? []);
    }
    return {};
  }
}

class EnquiryRepository {
  Future<List<Enquiry>> getMyEnquiries(String uid, {String? token}) async {
    final res = await http.get(
      Uri.parse('$kApiBaseUrl/enquiries?buyerId=$uid'),
      headers: _buildHeaders(token: token),
    );
    if (res.statusCode == 200) {
      final List list = jsonDecode(res.body);
      return list.map((e) => Enquiry.fromJson(e)).toList();
    }
    return [];
  }

  Stream<List<Enquiry>> watchEnquiries(String uid, {String? token}) async* {
    while (true) {
      try {
        yield await getMyEnquiries(uid, token: token);
      } catch (_) {}
      await Future.delayed(const Duration(seconds: 5));
    }
  }

  Future<void> create(Map<String, dynamic> data, {String? token}) async {
    await http.post(
      Uri.parse('$kApiBaseUrl/enquiries'),
      headers: _buildHeaders(token: token),
      body: jsonEncode(data),
    );
  }
}

// ---------------------------------------------------------------------------
// RIVERPOD PROVIDERS
// ---------------------------------------------------------------------------

// Authentication State & Providers
final authTokenProvider = StateProvider<String?>((ref) => null);
final authRepositoryProvider = Provider<AuthRepository>((ref) => AuthRepository());

final currentUserProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final token = ref.watch(authTokenProvider);
  if (token == null || token.isEmpty) return null;
  final authRepo = ref.watch(authRepositoryProvider);
  return authRepo.getProfile(token);
});

// Repositories
final catalogRepositoryProvider = Provider<CatalogRepository>((ref) {
  return CatalogRepository();
});

final cartRepositoryProvider = Provider<CartRepository>((ref) {
  return CartRepository();
});

final favoritesRepositoryProvider = Provider<FavoritesRepository>((ref) {
  return FavoritesRepository();
});

final enquiryRepositoryProvider = Provider<EnquiryRepository>((ref) {
  return EnquiryRepository();
});

// Data Streams with Automatic Authorization: Bearer <JWT_TOKEN>
final approvedProductsProvider = StreamProvider<List<dynamic>>((ref) {
  final repo = ref.watch(catalogRepositoryProvider);
  final token = ref.watch(authTokenProvider);
  return repo.watchApproved(token: token);
});

final bannersProvider = StreamProvider<List<BannerItem>>((ref) {
  final repo = ref.watch(catalogRepositoryProvider);
  final token = ref.watch(authTokenProvider);
  return repo.watchBanners(token: token);
});

final categoriesProvider = StreamProvider<List<String>>((ref) {
  final repo = ref.watch(catalogRepositoryProvider);
  final token = ref.watch(authTokenProvider);
  return repo.watchCategories(token: token);
});

final cartProvider = StreamProvider.family<List<CartItem>, String>((ref, uid) {
  final repo = ref.watch(cartRepositoryProvider);
  final token = ref.watch(authTokenProvider);
  return repo.watch(uid, token: token);
});

final favoriteIdsProvider = StreamProvider.family<Set<String>, String>((ref, uid) {
  final repo = ref.watch(favoritesRepositoryProvider);
  final token = ref.watch(authTokenProvider);
  return repo.watchIds(uid, token: token);
});

final myEnquiriesProvider = StreamProvider.family<List<Enquiry>, String>((ref, uid) {
  final repo = ref.watch(enquiryRepositoryProvider);
  final token = ref.watch(authTokenProvider);
  return repo.watchEnquiries(uid, token: token);
});

// UI Navigation State
// 0: Home, 1: Saved, 2: Cart, 3: Orders, 4: Profile
final tabIndexProvider = StateProvider<int>((ref) => 0);
