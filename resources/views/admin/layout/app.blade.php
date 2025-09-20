<!DOCTYPE html>
<html lang="zxx" class="js">
   <head>
      <meta charset="utf-8">
      <meta name="author" content="Softnio">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="description"
         content="A powerful and conceptual apps base dashboard template that especially build for developers and programmers.">
      <meta name="csrf-token" content="{{ csrf_token() }}">
      <link rel="shortcut icon" href="/demo2/images/favicon.png">
      <title>{{ env('APP_NAME') }}</title>
      <link rel="stylesheet" href="{{ asset('admin/assets/css/dashlite.css?ver=3.3.0') }}">
      <link id="skin-default" rel="stylesheet" href="{{ asset('admin/assets/css/theme.css?ver=3.3.0') }}">
   </head>
   <body class="nk-body bg-lighter npc-general has-sidebar ">
      <div class="nk-app-root">
         <div class="nk-main ">
            <div class="nk-sidebar nk-sidebar-fixed is-dark" data-content="sidebarMenu">
               <div class="nk-sidebar-element nk-sidebar-head">
                  <div class="nk-sidebar-brand">
                     <a href="/demo2/index.html" class="logo-link nk-sidebar-logo">
                        <h3>{{ env('APP_NAME') }}</h3>
                     </a>
                  </div>
                  <div class="nk-menu-trigger me-n2"><a href="#" class="nk-nav-toggle nk-quick-nav-icon d-xl-none"
                     data-target="sidebarMenu"><em class="icon ni ni-arrow-left"></em></a><a
                     href="#" class="nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex"
                     data-target="sidebarMenu"><em class="icon ni ni-menu"></em></a></div>
               </div>
               <div class="nk-sidebar-element">
                  <div class="nk-sidebar-content">
                     <div class="nk-sidebar-menu" data-simplebar>
                        <ul class="nk-menu">
                           <li class="nk-menu-item"><a href="{{ route('admin.dashboard') }}" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-dashboard-fill"></em></span><span
                              class="nk-menu-text">Dashboard</span></a>
                           </li>
                           <li class="nk-menu-item"><a href="{{ route('admin.products.index') }}" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-package-fill"></em></span><span
                              class="nk-menu-text">Products</span></a>
                           </li>
                           <li class="nk-menu-item"><a href="{{ route('admin.orders.index')}}" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-bag-fill"></em></span><span
                              class="nk-menu-text">Orders</span></a></li>
                            <li class="nk-menu-item"><a href="{{ route('admin.categories.index')}}" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-tag-fill"></em></span><span
                              class="nk-menu-text">Categories</span></a></li>
                           <li class="nk-menu-item"><a href="{{ route('admin.coming-soon.index')}}" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-clock"></em></span><span
                              class="nk-menu-text">Coming Soon</span></a></li>
                           <li class="nk-menu-item"><a href="/demo2/ecommerce/customers.html"
                              class="nk-menu-link"><span class="nk-menu-icon"><em
                              class="icon ni ni-users-fill"></em></span><span class="nk-menu-text">Customers</span></a>
                           </li>

                           <li class="nk-menu-item"><a href="/demo2/ecommerce/settings.html" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-opt-alt-fill"></em></span><span
                              class="nk-menu-text">Settings</span></a></li>

                           <li class="nk-menu-heading">
                              <h6 class="overline-title text-primary-alt">Return to</h6>
                           </li>
                           <li class="nk-menu-item"><a href="/demo2/index.html" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-dashlite-alt"></em></span><span
                              class="nk-menu-text">Main Dashboard</span></a></li>
                           <li class="nk-menu-item"><a href="/demo2/components.html" class="nk-menu-link"><span
                              class="nk-menu-icon"><em class="icon ni ni-layers-fill"></em></span><span
                              class="nk-menu-text">All Components</span></a></li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
            <div class="nk-wrap ">
               <div class="nk-header nk-header-fixed is-light">
                  <div class="container-fluid">
                     <div class="nk-header-wrap">
                        <div class="nk-menu-trigger d-xl-none ms-n1"><a href="#" class="nk-nav-toggle nk-quick-nav-icon"
                           data-target="sidebarMenu"><em
                           class="icon ni ni-menu"></em></a></div>
                        <div class="nk-header-brand d-xl-none"><a href="/demo2/index.html" class="logo-link"><img
                           class="logo-light logo-img" src="/demo2/images/logo.png"
                           srcset="/demo2/images/logo2x.png 2x" alt="logo"><img class="logo-dark logo-img"
                           src="/demo2/images/logo-dark.png"
                           srcset="/demo2/images/logo-dark2x.png 2x"
                           alt="logo-dark"></a></div>
                        <div class="nk-header-tools">
                           <ul class="nk-quick-nav">
                              <li class="dropdown notification-dropdown">
                                 <a href="#"
                                    class="dropdown-toggle nk-quick-nav-icon"
                                    data-bs-toggle="dropdown">
                                    <div class="icon-status icon-status-info"><em class="icon ni ni-bell"></em>
                                    </div>
                                 </a>
                                 <div class="dropdown-menu dropdown-menu-xl dropdown-menu-end">
                                    <div class="dropdown-head"><span class="sub-title nk-dropdown-title">Notifications</span><a
                                       href="#">Mark All as Read</a></div>
                                    <div class="dropdown-body">
                                       <div class="nk-notification">
                                          <div class="nk-notification-item dropdown-inner">
                                             <div class="nk-notification-icon"><em
                                                class="icon icon-circle bg-warning-dim ni ni-curve-down-right"></em>
                                             </div>
                                             <div class="nk-notification-content">
                                                <div class="nk-notification-text">You have requested to <span>Widthdrawl</span>
                                                </div>
                                                <div class="nk-notification-time">2 hrs ago</div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div class="dropdown-foot center"><a href="#">View All</a></div>
                                 </div>
                              </li>
                              <li class="dropdown user-dropdown">
                                 <a href="#" class="dropdown-toggle me-n1"
                                    data-bs-toggle="dropdown">
                                    <div class="user-toggle">
                                       <div class="user-avatar sm"><em class="icon ni ni-user-alt"></em></div>
                                       <div class="user-info d-none d-xl-block">
                                          <div class="user-status user-status-active">Administrator</div>
                                          <div class="user-name dropdown-indicator">{{ auth()->user()->name ?? ''}}</div>
                                       </div>
                                    </div>
                                 </a>
                                 <div class="dropdown-menu dropdown-menu-md dropdown-menu-end">
                                    <div class="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                                       <div class="user-card">
                                          <div class="user-avatar"><span>AD</span></div>
                                          <div class="user-info"><span
                                             class="lead-text">{{ auth()->user()->name ?? ''}}</span><span class="sub-text">{{ auth()->user()->email ?? ''}}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div class="dropdown-inner">
                                       <ul class="link-list">
                                          <li><a href="/demo2/ecommerce/user-profile.html"><em
                                             class="icon ni ni-user-alt"></em><span>View Profile</span></a>
                                          </li>
                                          <li><a href="/demo2/ecommerce/user-profile.html"><em
                                             class="icon ni ni-setting-alt"></em><span>Account Setting</span></a>
                                          </li>
                                          <li><a href="/demo2/ecommerce/user-profile.html"><em
                                             class="icon ni ni-activity-alt"></em><span>Login Activity</span></a>
                                          </li>
                                       </ul>
                                    </div>
                                    <div class="dropdown-inner">
                                       <ul class="link-list">
                                          <li><a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><em
                                             class="icon ni ni-signout"></em><span>Sign out</span></a>
                                          </li>
                                       </ul>
                                    </div>
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
               @yield('content')

               <!-- Logout Form -->
               <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                   @csrf
               </form>

               <div class="nk-footer">
                  <div class="container-fluid">
                     <div class="nk-footer-wrap">
                        <div class="nk-footer-copyright"> &copy; 2024 DashLite. Template by <a
                           href="https://softnio.com" target="_blank">Softnio</a></div>
                        <div class="nk-footer-links">
                           <ul class="nav nav-sm">
                              <li class="nav-item dropup">
                                 <a href="#"
                                    class="dropdown-toggle dropdown-indicator has-indicator nav-link text-base"
                                    data-bs-toggle="dropdown" data-offset="0,10"><span>English</span></a>
                                 <div class="dropdown-menu dropdown-menu-sm dropdown-menu-end">
                                    <ul class="language-list">
                                       <li><a href="#" class="language-item"><span
                                          class="language-name">English</span></a></li>
                                       <li><a href="#" class="language-item"><span
                                          class="language-name">Español</span></a></li>
                                       <li><a href="#" class="language-item"><span
                                          class="language-name">Français</span></a></li>
                                       <li><a href="#" class="language-item"><span
                                          class="language-name">Türkçe</span></a></li>
                                    </ul>
                                 </div>
                              </li>
                              <li class="nav-item"><a data-bs-toggle="modal" href="#region" class="nav-link"><em
                                 class="icon ni ni-globe"></em><span class="ms-1">Select Region</span></a>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="modal fade" tabindex="-1" role="dialog" id="region">
         <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
               <a href="#" class="close" data-bs-dismiss="modal"><em
                  class="icon ni ni-cross-sm"></em></a>
               <div class="modal-body modal-body-md">
                  <h5 class="title mb-4">Select Your Country</h5>
                  <div class="nk-country-region">
                     <ul class="country-list text-center gy-2">
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/arg.png" alt=""
                           class="country-flag"><span class="country-name">Argentina</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/aus.png" alt=""
                           class="country-flag"><span class="country-name">Australia</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/bangladesh.png" alt=""
                           class="country-flag"><span class="country-name">Bangladesh</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/canada.png" alt=""
                           class="country-flag"><span class="country-name">Canada <small>(English)</small></span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/china.png" alt=""
                           class="country-flag"><span class="country-name">Centrafricaine</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/china.png" alt=""
                           class="country-flag"><span
                           class="country-name">China</span></a></li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/french.png" alt=""
                           class="country-flag"><span
                           class="country-name">France</span></a></li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/germany.png" alt=""
                           class="country-flag"><span class="country-name">Germany</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/iran.png" alt=""
                           class="country-flag"><span
                           class="country-name">Iran</span></a></li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/italy.png" alt=""
                           class="country-flag"><span
                           class="country-name">Italy</span></a></li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/mexico.png" alt=""
                           class="country-flag"><span
                           class="country-name">México</span></a></li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/philipine.png" alt=""
                           class="country-flag"><span class="country-name">Philippines</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/portugal.png" alt=""
                           class="country-flag"><span class="country-name">Portugal</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/s-africa.png" alt=""
                           class="country-flag"><span class="country-name">South Africa</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/spanish.png" alt=""
                           class="country-flag"><span
                           class="country-name">Spain</span></a></li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/switzerland.png" alt=""
                           class="country-flag"><span class="country-name">Switzerland</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/uk.png" alt=""
                           class="country-flag"><span class="country-name">United Kingdom</span></a>
                        </li>
                        <li><a href="#" class="country-item"><img src="/demo2/images/flags/english.png" alt=""
                           class="country-flag"><span class="country-name">United State</span></a>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <ul class="nk-sticky-toolbar">
         <li class="demo-layout"><a class="toggle tipinfo" data-target="demoML" href="#" title="Main Demo Preview"><em
            class="icon ni ni-dashlite"></em></a></li>
         <li class="demo-thumb"><a class="toggle tipinfo" data-target="demoUC" href="#" title="Use Case Concept"><em
            class="icon ni ni-menu-squared"></em></a></li>
         <li class="demo-settings"><a class="toggle tipinfo" data-target="settingPanel" href="#" title="Demo Settings"><em
            class="icon ni ni-setting-alt"></em></a></li>
         <li class="demo-purchase"><a class="tipinfo" target="_blank" href="https://1.envato.market/e0y3g"
            title="Purchase"><em class="icon ni ni-cart"></em></a></li>
      </ul>
      <div class="nk-demo-panel nk-demo-panel-2x toggle-slide toggle-slide-right" data-content="demoML"
         data-toggle-overlay="true" data-toggle-body="true" data-toggle-screen="any">
         <div class="nk-demo-head">
            <h6 class="mb-0">Switch Demo Layout</h6>
            <a
               class="nk-demo-close toggle btn btn-icon btn-trigger revarse mr-n2" data-target="demoML" href="#"><em
               class="icon ni ni-cross"></em></a>
         </div>
         <div class="nk-demo-list" data-simplebar>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo1/index.html">
                  <div class="nk-demo-image bg-blue"><img class="bg-purple"
                     src="https://dashlite.net/images/landing/layout-1d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-1d2x.jpg 2x"
                     alt="Demo Layout 1"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 1</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo2/index.html">
                  <div class="nk-demo-image bg-purple"><img src="https://dashlite.net/images/landing/layout-2d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-2d2x.jpg 2x"
                     alt="Demo Layout 2"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 2</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo3/index.html">
                  <div class="nk-demo-image bg-success"><img src="https://dashlite.net/images/landing/layout-3d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-3d2x.jpg 2x"
                     alt="Demo Layout 3"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 3</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo4/index.html">
                  <div class="nk-demo-image bg-indigo"><img src="https://dashlite.net/images/landing/layout-4d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-4d2x.jpg 2x"
                     alt="Demo Layout 4"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 4</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo5/index.html">
                  <div class="nk-demo-image bg-orange"><img src="https://dashlite.net/images/landing/layout-5d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-5d2x.jpg 2x"
                     alt="Demo Layout 5"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 5</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo6/index.html">
                  <div class="nk-demo-image bg-purple"><img src="https://dashlite.net/images/landing/layout-6d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-6d2x.jpg 2x"
                     alt="Demo Layout 6"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 6</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo7/index.html">
                  <div class="nk-demo-image bg-teal"><img src="https://dashlite.net/images/landing/layout-7d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-7d2x.jpg 2x"
                     alt="Demo Layout 7"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 7</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo8/index.html">
                  <div class="nk-demo-image bg-azure"><img src="https://dashlite.net/images/landing/layout-8d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-8d2x.jpg 2x"
                     alt="Demo Layout 8"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 8</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo9/index.html">
                  <div class="nk-demo-image bg-pink"><img src="https://dashlite.net/images/landing/layout-9d.jpg"
                     srcset="https://dashlite.net/images/landing/layout-9d2x.jpg 2x"
                     alt="Demo Layout 9"></div>
                  <span class="nk-demo-title"><strong>Demo Layout 9</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/landing/index.html">
                  <div class="nk-demo-image bg-red"><img src="https://dashlite.net/images/landing/main-landing.jpg"
                     srcset="https://dashlite.net/images/landing/main-landing2x.jpg 2x"
                     alt="Landing Page"></div>
                  <span class="nk-demo-title"><strong>Landing Page</strong> <span
                     class="badge badge-danger ml-1">Free</span></span>
               </a>
            </div>
         </div>
      </div>
      <div class="nk-demo-panel nk-demo-panel-2x toggle-slide toggle-slide-right" data-content="demoUC"
         data-toggle-overlay="true" data-toggle-body="true" data-toggle-screen="any">
         <div class="nk-demo-head">
            <h6 class="mb-0">Use Case Concept</h6>
            <a
               class="nk-demo-close toggle btn btn-icon btn-trigger revarse mr-n2" data-target="demoUC" href="#"><em
               class="icon ni ni-cross"></em></a>
         </div>
         <div class="nk-demo-list" data-simplebar>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo9/copywriter/index.html">
                  <div class="nk-demo-image bg-indigo"><img
                     src="https://dashlite.net/images/landing/demo-ai-copywriter.jpg"
                     srcset="https://dashlite.net/images/landing/demo-ai-copywriter2x.jpg 2x" alt="ai-copywriter">
                  </div>
                  <span class="nk-demo-title"><em class="text-primary">Demo9</em><br><strong>Ai Copywriter Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo7/pharmacy/index.html">
                  <div class="nk-demo-image bg-warning"><img src="https://dashlite.net/images/landing/demo-pharmacy.jpg"
                     srcset="https://dashlite.net/images/landing/demo-pharmacy2x.jpg 2x"
                     alt="pharmacy"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo7</em><br><strong>Pharmacy Management Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo5/loan/index.html">
                  <div class="nk-demo-image bg-purple"><img src="https://dashlite.net/images/landing/demo-loan.jpg"
                     srcset="https://dashlite.net/images/landing/demo-loan2x.jpg 2x"
                     alt="loan"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo5</em><br><strong>Loan Management Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo2/ecommerce/index.html">
                  <div class="nk-demo-image bg-dark"><img src="https://dashlite.net/images/landing/demo-ecommerce.jpg"
                     srcset="https://dashlite.net/images/landing/demo-ecommerce2x.jpg 2x"
                     alt="Ecommerce"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo2</em><br><strong>E-Commerce Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo2/lms/index.html">
                  <div class="nk-demo-image bg-danger"><img src="https://dashlite.net/images/landing/demo-lms.jpg"
                     srcset="https://dashlite.net/images/landing/demo-lms2x.jpg 2x"
                     alt="LMS"></div>
                  <span class="nk-demo-title"><em class="text-primary">Demo2</em><br><strong>LMS / Learning Management System</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo1/crm/index.html">
                  <div class="nk-demo-image bg-info"><img src="https://dashlite.net/images/landing/demo-crm.jpg"
                     srcset="https://dashlite.net/images/landing/demo-crm2x.jpg 2x"
                     alt="CRM / Customer Relationship"></div>
                  <span class="nk-demo-title"><em class="text-primary">Demo1</em><br><strong>CRM / Customer Relationship Management</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo7/hospital/index.html">
                  <div class="nk-demo-image bg-indigo"><img src="https://dashlite.net/images/landing/demo-hospital.jpg"
                     srcset="https://dashlite.net/images/landing/demo-hospital2x.jpg 2x"
                     alt="Hospital Managemen"></div>
                  <span class="nk-demo-title"><em class="text-primary">Demo7</em><br><strong>Hospital Management</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo1/hotel/index.html">
                  <div class="nk-demo-image bg-pink"><img src="https://dashlite.net/images/landing/demo-hotel.jpg"
                     srcset="https://dashlite.net/images/landing/demo-hotel2x.jpg 2x"
                     alt="Hotel Managemen"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo1</em><br><strong>Hotel Management</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo3/cms/index.html">
                  <div class="nk-demo-image bg-dark"><img src="https://dashlite.net/images/landing/demo-cms.jpg"
                     srcset="https://dashlite.net/images/landing/demo-cms2x.jpg 2x"
                     alt="cms"></div>
                  <span class="nk-demo-title"><em class="text-primary">Demo3</em><br><strong>CMS Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo5/crypto/index.html">
                  <div class="nk-demo-image bg-warning"><img src="https://dashlite.net/images/landing/demo-buysell.jpg"
                     srcset="https://dashlite.net/images/landing/demo-buysell2x.jpg 2x"
                     alt="Crypto BuySell / Wallet"></div>
                  <span class="nk-demo-title"><em class="text-primary">Demo5</em><br><strong>Crypto BuySell Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo6/invest/index.html">
                  <div class="nk-demo-image bg-indigo"><img src="https://dashlite.net/images/landing/demo-invest.jpg"
                     srcset="https://dashlite.net/images/landing/demo-invest2x.jpg 2x"
                     alt="HYIP / Investment"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo6</em><br><strong>HYIP / Investment Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo3/apps/file-manager.html">
                  <div class="nk-demo-image bg-purple"><img
                     src="https://dashlite.net/images/landing/demo-file-manager.jpg"
                     srcset="https://dashlite.net/images/landing/demo-file-manager2x.jpg 2x" alt="File Manager">
                  </div>
                  <span class="nk-demo-title"><em class="text-primary">Demo3</em><br><strong>Apps - File Manager</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo4/subscription/index.html">
                  <div class="nk-demo-image bg-primary"><img
                     src="https://dashlite.net/images/landing/demo-subscription.jpg"
                     srcset="https://dashlite.net/images/landing/demo-subscription2x.jpg 2x"
                     alt="SAAS / Subscription"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo4</em><br><strong>SAAS / Subscription Panel</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/covid/index.html">
                  <div class="nk-demo-image bg-danger"><img src="https://dashlite.net/images/landing/demo-covid19.jpg"
                     srcset="https://dashlite.net/images/landing/demo-covid192x.jpg 2x"
                     alt="Covid Situation"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Covid</em><br><strong>Coronavirus Situation</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo3/apps/messages.html">
                  <div class="nk-demo-image bg-success"><img src="https://dashlite.net/images/landing/demo-messages.jpg"
                     srcset="https://dashlite.net/images/landing/demo-messages2x.jpg 2x"
                     alt="Messages"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo3</em><br><strong>Apps - Messages</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo3/apps/mailbox.html">
                  <div class="nk-demo-image bg-purple"><img src="https://dashlite.net/images/landing/demo-inbox.jpg"
                     srcset="https://dashlite.net/images/landing/demo-inbox2x.jpg 2x"
                     alt="Inbox"></div>
                  <span class="nk-demo-title"><em
                     class="text-primary">Demo3</em><br><strong>Apps - Mailbox</strong></span>
               </a>
            </div>
            <div class="nk-demo-item">
               <a href="https://dashlite.net/demo3/apps/chats.html">
                  <div class="nk-demo-image bg-purple"><img src="https://dashlite.net/images/landing/demo-chats.jpg"
                     srcset="https://dashlite.net/images/landing/demo-chats2x.jpg 2x"
                     alt="Chats / Messenger"></div>
                  <span class="nk-demo-title"><em class="text-primary">Demo3</em><br><strong>Apps - Chats</strong></span>
               </a>
            </div>
         </div>
      </div>
      <div class="nk-demo-panel toggle-slide toggle-slide-right" data-content="settingPanel" data-toggle-overlay="true"
         data-toggle-body="true" data-toggle-screen="any">
         <div class="nk-demo-head">
            <h6 class="mb-0">Preview Settings</h6>
            <a
               class="nk-demo-close toggle btn btn-icon btn-trigger revarse mr-n2" data-target="settingPanel" href="#"><em
               class="icon ni ni-cross"></em></a>
         </div>
         <div class="nk-opt-panel" data-simplebar>
            <div class="nk-opt-set">
               <div class="nk-opt-set-title">Direction Change</div>
               <div class="nk-opt-list col-2x">
                  <div class="nk-opt-item only-text active" data-key="dir" data-update="ltr"><span class="nk-opt-item-bg"><span
                     class="nk-opt-item-name">LTR Mode</span></span></div>
                  <div class="nk-opt-item only-text" data-key="dir" data-update="rtl"><span class="nk-opt-item-bg"><span
                     class="nk-opt-item-name">RTL Mode</span></span></div>
               </div>
            </div>
            <div class="nk-opt-set">
               <div class="nk-opt-set-title">Main UI Style</div>
               <div class="nk-opt-list col-2x">
                  <div class="nk-opt-item only-text active" data-key="style" data-update="ui-default"><span
                     class="nk-opt-item-bg"><span class="nk-opt-item-name">Default</span></span></div>
                  <div class="nk-opt-item only-text" data-key="style" data-update="ui-bordered"><span
                     class="nk-opt-item-bg"><span class="nk-opt-item-name">Bordered</span></span></div>
               </div>
            </div>
            <div class="nk-opt-set nk-opt-set-aside">
               <div class="nk-opt-set-title">Sidebar Style</div>
               <div class="nk-opt-list col-4x">
                  <div class="nk-opt-item" data-key="aside" data-update="is-light"><span
                     class="nk-opt-item-bg is-light"><span class="bg-lighter"></span></span><span
                     class="nk-opt-item-name">White</span></div>
                  <div class="nk-opt-item" data-key="aside" data-update="is-default"><span
                     class="nk-opt-item-bg is-light"><span class="bg-light"></span></span><span
                     class="nk-opt-item-name">Light</span></div>
                  <div class="nk-opt-item active" data-key="aside" data-update="is-dark"><span
                     class="nk-opt-item-bg"><span class="bg-dark"></span></span><span
                     class="nk-opt-item-name">Dark</span></div>
                  <div class="nk-opt-item" data-key="aside" data-update="is-theme"><span class="nk-opt-item-bg"><span
                     class="bg-theme"></span></span><span class="nk-opt-item-name">Theme</span></div>
               </div>
            </div>
            <div class="nk-opt-set nk-opt-set-header">
               <div class="nk-opt-set-title">Header Style</div>
               <div class="nk-opt-list col-4x">
                  <div class="nk-opt-item active" data-key="header" data-update="is-light"><span
                     class="nk-opt-item-bg is-light"><span class="bg-lighter"></span></span><span
                     class="nk-opt-item-name">White</span></div>
                  <div class="nk-opt-item" data-key="header" data-update="is-default"><span
                     class="nk-opt-item-bg is-light"><span class="bg-light"></span></span><span
                     class="nk-opt-item-name">Light</span></div>
                  <div class="nk-opt-item" data-key="header" data-update="is-dark"><span class="nk-opt-item-bg"><span
                     class="bg-dark"></span></span><span class="nk-opt-item-name">Dark</span></div>
                  <div class="nk-opt-item" data-key="header" data-update="is-theme"><span class="nk-opt-item-bg"><span
                     class="bg-theme"></span></span><span class="nk-opt-item-name">Theme</span></div>
               </div>
            </div>
            <div class="nk-opt-set nk-opt-set-skin">
               <div class="nk-opt-set-title">Primary Skin</div>
               <div class="nk-opt-list">
                  <div class="nk-opt-item active" data-key="skin" data-update="default"><span class="nk-opt-item-bg"><span
                     class="skin-default"></span></span><span class="nk-opt-item-name">Default</span></div>
                  <div class="nk-opt-item" data-key="skin" data-update="blue"><span class="nk-opt-item-bg"><span
                     class="skin-blue"></span></span><span class="nk-opt-item-name">Blue</span></div>
                  <div class="nk-opt-item" data-key="skin" data-update="egyptian"><span class="nk-opt-item-bg"><span
                     class="skin-egyptian"></span></span><span class="nk-opt-item-name">Egyptian</span></div>
                  <div class="nk-opt-item" data-key="skin" data-update="bluelite"><span class="nk-opt-item-bg"><span
                     class="skin-bluelite"></span></span><span class="nk-opt-item-name">Blue Light</span></div>
                  <div class="nk-opt-item" data-key="skin" data-update="green"><span class="nk-opt-item-bg"><span
                     class="skin-green"></span></span><span class="nk-opt-item-name">Green</span></div>
                  <div class="nk-opt-item" data-key="skin" data-update="red"><span class="nk-opt-item-bg"><span
                     class="skin-red"></span></span><span class="nk-opt-item-name">Red</span></div>
               </div>
            </div>
            <div class="nk-opt-set">
               <div class="nk-opt-set-title">Skin Mode</div>
               <div class="nk-opt-list col-2x">
                  <div class="nk-opt-item active" data-key="mode" data-update="light-mode"><span
                     class="nk-opt-item-bg is-light"><span class="theme-light"></span></span><span
                     class="nk-opt-item-name">Light Skin</span></div>
                  <div class="nk-opt-item" data-key="mode" data-update="dark-mode"><span class="nk-opt-item-bg"><span
                     class="theme-dark"></span></span><span class="nk-opt-item-name">Dark Skin</span></div>
               </div>
            </div>
            <div class="nk-opt-reset"><a href="#" class="reset-opt-setting">Reset Setting</a></div>
         </div>
      </div>
      <script src="{{ asset('admin/assets/js/bundle.js?ver=3.3.0') }}"></script>
      <script src="{{ asset('admin/assets/js/scripts.js?ver=3.3.0') }}"></script>
      <script src="{{ asset('admin/assets/js/demo-settings.js?ver=3.3.0') }}"></script>
      <script src="{{ asset('admin/assets/js/charts/chart-ecommerce.js?ver=3.3.0') }}"></script>

      <!-- jQuery and Bootstrap JS for modal functionality -->
      <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>

      @stack('scripts')
   </body>
</html>
