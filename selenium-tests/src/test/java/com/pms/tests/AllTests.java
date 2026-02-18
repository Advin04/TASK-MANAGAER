package com.pms.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import org.testng.Assert;
import org.testng.annotations.*;

import java.time.Duration;
import java.util.List;

/**
 * ============================================================
 *  MASTER TEST SUITE - Project Management System
 * ============================================================
 *  RIGHT-CLICK this file → Run As → Maven test / TestNG Test
 *  Everything runs AUTOMATICALLY. No manual input needed!
 * 
 *  Flow: Register → Login → Dashboard → Create Project
 * ============================================================
 */
public class AllTests {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:5173";

    // Unique email every run — prevents "user already exists" errors
    private static final String TEST_NAME = "Test User";
    private static final String TEST_EMAIL = "testuser_" + System.currentTimeMillis() + "@example.com";
    private static final String TEST_PASSWORD = "Test@123";

    // ==================== SETUP & TEARDOWN ====================

    // ==================== SETUP & TEARDOWN ====================

    @BeforeClass
    public void setupBrowser() {
        System.out.println("============================================");
        System.out.println("  STARTING AUTOMATED SELENIUM TESTS");
        System.out.println("  Test Email: " + TEST_EMAIL);
        System.out.println("============================================");

        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-allow-origins=*");
        // options.addArguments("--headless"); // Uncomment to run headless if needed
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        driver.manage().window().maximize();
        // Reduced implicit wait to avoid long hangs on missing elements
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterClass
    public void closeBrowser() {
        System.out.println("============================================");
        System.out.println("  ALL TESTS COMPLETED!");
        System.out.println("============================================");
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception e) {
                // ignore
            }
        }
    }

    /**
     * Ensures driver is active. If crashed/closed, restarts it.
     */
    private void ensureDriver() {
        if (driver == null) {
            setupBrowser();
            return;
        }
        try {
            driver.getCurrentUrl(); // This throws if session is invalid
        } catch (Exception e) {
            System.out.println("   ⚠️ Browser session lost (" + e.getMessage() + ")! Restarting...");
            try { driver.quit(); } catch (Exception ignore) {}
            setupBrowser();
        }
    }

    /**
     * Helper: clears cookies and storage so we start fresh (logged out)
     */
    private void logout() {
        ensureDriver();
        try {
            // Only clear if we are not already on login page
            if (!driver.getCurrentUrl().contains("/login")) {
                driver.manage().deleteAllCookies();
                driver.get(BASE_URL + "/auth/login");
                org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
                js.executeScript("localStorage.clear(); sessionStorage.clear();");
            }
        } catch (Exception e) {
            System.out.println("   ⚠️ Error during logout: " + e.getMessage());
            ensureDriver();
        }
    }

    // ==================== MODULE 1: REGISTRATION PAGE ====================

    @Test(priority = 1)
    public void test01_RegistrationPageLoads() {
        System.out.println("\n>>> MODULE 1: REGISTRATION PAGE <<<");
        logout();
        driver.get(BASE_URL + "/auth/register");
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/register");

        WebElement form = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("register-form"))
        );
        Assert.assertTrue(form.isDisplayed(), "Registration form should be visible");
        System.out.println("   PASS: Registration page loaded successfully");
    }

    @Test(priority = 2, dependsOnMethods = "test01_RegistrationPageLoads")
    public void test02_RegistrationFormFieldsExist() {
        WebElement nameInput = driver.findElement(By.id("register-name"));
        Assert.assertTrue(nameInput.isDisplayed(), "Name field should be visible");

        WebElement emailInput = driver.findElement(By.id("register-email"));
        Assert.assertTrue(emailInput.isDisplayed(), "Email field should be visible");

        WebElement passwordInput = driver.findElement(By.id("register-password"));
        Assert.assertTrue(passwordInput.isDisplayed(), "Password field should be visible");

        WebElement submitBtn = driver.findElement(By.id("register-submit"));
        Assert.assertTrue(submitBtn.isDisplayed(), "Submit button should be visible");
        System.out.println("   PASS: All registration form fields are present");
    }

    @Test(priority = 3, dependsOnMethods = "test02_RegistrationFormFieldsExist")
    public void test03_RegistrationLoginLinkExists() {
        WebElement loginLink = driver.findElement(By.linkText("Login here"));
        Assert.assertTrue(loginLink.isDisplayed(), "Login link should be visible on register page");
        System.out.println("   PASS: Login link exists on registration page");
    }

    @Test(priority = 4, dependsOnMethods = "test02_RegistrationFormFieldsExist")
    public void test04_SuccessfulRegistration() {
        // Fill registration form
        WebElement nameInput = driver.findElement(By.id("register-name"));
        nameInput.clear();
        nameInput.sendKeys(TEST_NAME);

        WebElement emailInput = driver.findElement(By.id("register-email"));
        emailInput.clear();
        emailInput.sendKeys(TEST_EMAIL);

        WebElement passwordInput = driver.findElement(By.id("register-password"));
        passwordInput.clear();
        passwordInput.sendKeys(TEST_PASSWORD);

        // Submit
        driver.findElement(By.id("register-submit")).click();

        // Wait for redirect to dashboard or login
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/dashboard"),
            ExpectedConditions.urlContains("/login"),
            ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--success"))
        ));

        String currentUrl = driver.getCurrentUrl();
        boolean success = currentUrl.contains("/dashboard") || currentUrl.contains("/login")
            || !driver.findElements(By.cssSelector(".Toastify__toast--success")).isEmpty();

        Assert.assertTrue(success, "Registration should succeed and redirect");
        System.out.println("   PASS: User registered successfully: " + TEST_EMAIL);
    }

    // ==================== MODULE 2: LOGIN PAGE ====================

    @Test(priority = 5)
    public void test05_LoginPageLoads() {
        System.out.println("\n>>> MODULE 2: LOGIN PAGE <<<");
        // Clear auth state to access login page
        logout();
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/login");
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/login");

        WebElement form = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("login-form"))
        );
        Assert.assertTrue(form.isDisplayed(), "Login form should be visible");
        System.out.println("   PASS: Login page loaded successfully");
    }

    @Test(priority = 6, dependsOnMethods = "test05_LoginPageLoads")
    public void test06_LoginFormFieldsExist() {
        WebElement emailInput = driver.findElement(By.id("login-email"));
        Assert.assertTrue(emailInput.isDisplayed(), "Email field should be visible");

        WebElement passwordInput = driver.findElement(By.id("login-password"));
        Assert.assertTrue(passwordInput.isDisplayed(), "Password field should be visible");

        WebElement submitBtn = driver.findElement(By.id("login-submit"));
        Assert.assertTrue(submitBtn.isDisplayed(), "Login button should be visible");
        System.out.println("   PASS: All login form fields are present");
    }

    @Test(priority = 7, dependsOnMethods = "test05_LoginPageLoads")
    public void test07_LoginRegisterLinkExists() {
        WebElement registerLink = driver.findElement(By.linkText("Register here"));
        Assert.assertTrue(registerLink.isDisplayed(), "Register link should be visible on login page");
        System.out.println("   PASS: Register link exists on login page");
    }

    @Test(priority = 8, dependsOnMethods = "test06_LoginFormFieldsExist")
    public void test08_InvalidLoginShowsError() {
        // First make sure we're on the login page fresh
        logout();
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/login");
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-form")));

        // Enter wrong credentials
        WebElement emailInput = driver.findElement(By.id("login-email"));
        emailInput.clear();
        emailInput.sendKeys("wrong@example.com");

        WebElement passwordInput = driver.findElement(By.id("login-password"));
        passwordInput.clear();
        passwordInput.sendKeys("wrongpassword");

        driver.findElement(By.id("login-submit")).click();

        // Wait for error toast or stay on login page
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".Toastify__toast--error")
            ));
            System.out.println("   PASS: Invalid login correctly shows error toast");
        } catch (Exception e) {
            // If no toast, at least verify we're still on login page
            Assert.assertTrue(driver.getCurrentUrl().contains("/login"),
                "Should stay on login page after invalid login");
            System.out.println("   PASS: Invalid login kept user on login page");
        }

        // Wait for any toast to clear
        try { Thread.sleep(1000); } catch (InterruptedException e) {}
    }

    @Test(priority = 9, dependsOnMethods = "test06_LoginFormFieldsExist")
    public void test09_SuccessfulLogin() {
        // Make sure we're logged out first
        logout();
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/login");
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        driver.get(BASE_URL + "/auth/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-form")));

        // Enter valid credentials
        System.out.println("   INFO: Attempting login with email: " + TEST_EMAIL);
        WebElement emailInput = driver.findElement(By.id("login-email"));
        emailInput.clear();
        emailInput.sendKeys(TEST_EMAIL);
        
        try { Thread.sleep(200); } catch (InterruptedException e) {}

        WebElement passwordInput = driver.findElement(By.id("login-password"));
        passwordInput.clear();
        passwordInput.sendKeys(TEST_PASSWORD);

        try { Thread.sleep(200); } catch (InterruptedException e) {}

        driver.findElement(By.id("login-submit")).click();

        // Wait for redirect to dashboard
        // Wait for redirect to dashboard OR error
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/dashboard"),
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--success")),
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--error"))
            ));
        } catch (Exception e) {
            Assert.fail("Login timed out. No success or error toast/redirect observed.");
        }

        // WAIT specifically for the URL to change to /dashboard for true stability
        try {
            wait.until(ExpectedConditions.urlContains("/dashboard"));
        } catch (Exception e) {
            // If URL didn't change, we might still be logged in if a session exists
            if (!driver.getCurrentUrl().contains("/dashboard")) {
                Assert.fail("Login succeeded but URL did not transition to /dashboard");
            }
        }

        Assert.assertTrue(driver.getCurrentUrl().contains("/dashboard"),
            "Should be on dashboard after successful login");
        System.out.println("   PASS: Login successful and URL verified: " + driver.getCurrentUrl());
    }

    // ==================== MODULE 3: HOME PAGE (DASHBOARD) ====================

    @Test(priority = 10, dependsOnMethods = "test09_SuccessfulLogin")
    public void test10_DashboardPageLoads() {
        System.out.println("\n>>> MODULE 3: HOME PAGE (DASHBOARD) <<<");

        // Login if not already logged in
        if (!driver.getCurrentUrl().contains("/dashboard")) {
            loginHelper();
        }

        // Wait for dashboard to fully load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("dashboard-page")));

        WebElement dashboardPage = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("dashboard-page"))
        );
        Assert.assertTrue(dashboardPage.isDisplayed(), "Dashboard page should be visible");
        System.out.println("   PASS: Dashboard page loaded successfully");
    }

    @Test(priority = 11, dependsOnMethods = "test10_DashboardPageLoads")
    public void test11_DashboardHasStatisticsCards() {
        WebElement totalTasks = driver.findElement(By.xpath("//*[contains(text(),'Total Tasks')]"));
        Assert.assertTrue(totalTasks.isDisplayed(), "Total Tasks card should be visible");

        WebElement todoTasks = driver.findElement(By.xpath("//*[contains(text(),'Todo Tasks')]"));
        Assert.assertTrue(todoTasks.isDisplayed(), "Todo Tasks card should be visible");

        WebElement inProgressTasks = driver.findElement(By.xpath("//*[contains(text(),'In Progress')]"));
        Assert.assertTrue(inProgressTasks.isDisplayed(), "In Progress card should be visible");

        WebElement completedTasks = driver.findElement(By.xpath("//*[contains(text(),'Completed')]"));
        Assert.assertTrue(completedTasks.isDisplayed(), "Completed Tasks card should be visible");

        System.out.println("   PASS: All statistics cards are displayed");
    }

    @Test(priority = 12, dependsOnMethods = "test10_DashboardPageLoads")
    public void test12_DashboardHasProjectsSection() {
        WebElement projectsHeader = driver.findElement(
            By.xpath("//*[contains(text(),'Projects')]")
        );
        Assert.assertTrue(projectsHeader.isDisplayed(), "Projects section should be visible");
        System.out.println("   PASS: Projects section is visible on dashboard");
    }

    @Test(priority = 13, dependsOnMethods = "test10_DashboardPageLoads")
    public void test13_DashboardURLIsCorrect() {
        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("/dashboard"),
            "URL should contain /dashboard, but was: " + currentUrl);
        System.out.println("   PASS: Dashboard URL is correct: " + currentUrl);
    }

    // ==================== MODULE 4: CREATE PROJECT (FUNCTIONALITY) ====================

    @Test(priority = 14, dependsOnMethods = "test09_SuccessfulLogin")
    public void test14_ProjectsPageLoads() {
        System.out.println("\n>>> MODULE 4: CREATE PROJECT FUNCTIONALITY <<<");

        // Make sure logged in, then navigate to projects
        // Fix: Check for both dashboard and admin to avoid unnecessary helper calls
        if (!driver.getCurrentUrl().contains("/admin") && !driver.getCurrentUrl().contains("/dashboard")) {
            loginHelper();
        }
        driver.get(BASE_URL + "/admin/projects");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("projects-page")));

        WebElement projectsPage = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("projects-page"))
        );
        Assert.assertTrue(projectsPage.isDisplayed(), "Projects page should be visible");
        System.out.println("   PASS: Projects page loaded successfully");
    }

    @Test(priority = 15, dependsOnMethods = "test14_ProjectsPageLoads")
    public void test15_CreateProjectButtonExists() {
        WebElement createBtn = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("create-project-btn"))
        );
        Assert.assertTrue(createBtn.isDisplayed(), "Create Project button should be visible");
        System.out.println("   PASS: Create Project (+) button is visible");
    }

    @Test(priority = 16, dependsOnMethods = "test15_CreateProjectButtonExists")
    public void test16_CreateProjectDialogOpens() {
        WebElement createBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.id("create-project-btn"))
        );
        createBtn.click();

        // Wait for dialog to open
        try { Thread.sleep(1000); } catch (InterruptedException e) {}

        WebElement projectName = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("project-name"))
        );
        Assert.assertTrue(projectName.isDisplayed(), "Project Name field should be visible");

        WebElement projectDesc = driver.findElement(By.id("project-description"));
        Assert.assertTrue(projectDesc.isDisplayed(), "Project Description should be visible");

        WebElement submitBtn = driver.findElement(By.id("project-submit"));
        Assert.assertTrue(submitBtn.isDisplayed(), "Submit button should be visible");
        System.out.println("   PASS: Create Project dialog opened with all fields");
    }

    // ==================== IMPROVED HELPER METHODS ====================

    private void loginHelper() {
        // If already on a page with sidebar or dashboard, assume logged in
        if (driver.getCurrentUrl().contains("/dashboard") || driver.getCurrentUrl().contains("/admin")) {
            System.out.println("   INFO: Already logged in, skipping login helper.");
            return;
        }

        // Force logout only if strictly necessary
        logout();
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        
        driver.get(BASE_URL + "/auth/login");
        
        // Clear Local Storage and Session Storage to ensure no stale state
        try {
            ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
            ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        } catch (Exception e) { /* ignore */ }
        
        driver.navigate().refresh();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-form")));

        driver.findElement(By.id("login-email")).clear();
        driver.findElement(By.id("login-email")).sendKeys(TEST_EMAIL);
        driver.findElement(By.id("login-password")).clear();
        driver.findElement(By.id("login-password")).sendKeys(TEST_PASSWORD);
        
        WebElement submitBtn = driver.findElement(By.id("login-submit"));
        wait.until(ExpectedConditions.elementToBeClickable(submitBtn));
        submitBtn.click();

        // Robust wait for login success
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/dashboard"),
            ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--success"))
        ));

        if (!driver.getCurrentUrl().contains("/dashboard")) {
             driver.get(BASE_URL + "/dashboard");
        }
        try { Thread.sleep(500); } catch (InterruptedException e) {}
    }

    @Test(priority = 17, dependsOnMethods = "test16_CreateProjectDialogOpens")
    public void test17_CreateNewProjectSuccessfully() {
        // Wait for animation to finish
        try { Thread.sleep(1000); } catch (InterruptedException e) {}

        // 1. Fill Project Name
        WebElement projectName = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("project-name")));
        projectName.clear();
        projectName.sendKeys("Selenium Test Project");

        // 2. Fill Project Description
        WebElement projectDesc = driver.findElement(By.id("project-description"));
        projectDesc.clear();
        projectDesc.sendKeys("Created automatically by Selenium test automation");

        // 3. Select Project Manager (Material Tailwind Select)
        // STRATEGY: Material Tailwind often hides the ID. We try multiple approaches.
        boolean pmSelected = false;
        try {
            System.out.println("   INFO: Attempting to open Project Manager dropdown...");
            
            // Approach 1: Try finding by the visible label's sibling (usually the trigger)
            try {
                WebElement label = driver.findElement(By.xpath("//label[contains(text(), 'Project Manager')]"));
                // In Material Tailwind, the trigger is usually a sibling or parent.
                // We'll try clicking the label itself first (sometimes works)
                label.click();
                System.out.println("   INFO: Clicked via Label");
            } catch (Exception e) {
                // Approach 2: Try the ID (might be on a wrapper)
                try {
                    driver.findElement(By.id("project-manager-select")).click();
                    System.out.println("   INFO: Clicked via ID");
                } catch (Exception e2) {
                    // Approach 3: JS Click on the generic Select container
                     WebElement container = driver.findElement(By.xpath("//*[text()='Project Manager']/ancestor::div[contains(@class, 'relative')]"));
                     ((JavascriptExecutor) driver).executeScript("arguments[0].click();", container);
                     System.out.println("   INFO: Clicked via Container JS");
                }
            }

            // Wait for options and click the first one (Test User)
            try {
                Thread.sleep(500); // Allow dropdown animation
                WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(5));
                
                // Look for the option list
                WebElement firstOption = shortWait.until(ExpectedConditions.elementToBeClickable(By.xpath("//li[@role='option']")));
                String optionText = firstOption.getText();
                System.out.println("   INFO: Found option: " + optionText);
                
                firstOption.click();
                
                // VERIFY: Check if the selection stuck
                // The selected text should appear in the button/display area
                // We look for any element containing the text we just selected
                try {
                    shortWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '" + optionText + "')]")));
                    pmSelected = true;
                    System.out.println("   PASS: Project Manager selected: " + optionText);
                } catch (Exception verifyErr) {
                    System.out.println("   ⚠️ UI verification failed, but continuing.");
                }

            } catch (Exception e) {
                 System.out.println("   ❌ Dropdown options did not appear: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("   ❌ Failed to interact with Project Manager select: " + e.getMessage());
        }

        // 4. Select Team Members (Custom Multiselect)
        try {
            WebElement teamSelect = driver.findElement(By.id("team-members-select"));
            teamSelect.click();
            try { Thread.sleep(500); } catch (InterruptedException e) {}
            
            // Click the first available user in the dropdown
            WebElement firstUser = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(@class, 'absolute')]//div[contains(@class, 'cursor-pointer')]")));
            firstUser.click();
            
            // Click outside to close dropdown (optional, but good practice)
            driver.findElement(By.id("project-name")).click(); 
        } catch (Exception e) {
            System.out.println("   ⚠️ Could not select Team Member: " + e.getMessage());
        }

        // 5. Submit
        WebElement submitBtn = driver.findElement(By.id("project-submit"));
        wait.until(ExpectedConditions.elementToBeClickable(submitBtn));
        submitBtn.click();

        // Wait for success toast - increased timeout significantly
        try {
            WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(10));
            longWait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--success")));
            System.out.println("   PASS: Success toast appeared!");
        } catch (Exception e) {
            System.out.println("   ⚠️ Warning: Success toast didn't appear in time, checking project list...");
        }

        // Check if dialog closed (project was created)
        try { Thread.sleep(1000); } catch (InterruptedException e) {}
        List<WebElement> nameFields = driver.findElements(By.id("project-name"));
        boolean dialogClosed = nameFields.isEmpty() || !nameFields.get(0).isDisplayed();
        
        // If dialog still open, maybe we need to click submit again? (Network lag?)
        if (!dialogClosed) {
            System.out.println("   ⚠️ Dialog still open. Trying to check for success anyway.");
            // Sometimes it closes but element reference lingers.
        }
        
        Assert.assertTrue(dialogClosed, "Project creation dialog should close on success");
        System.out.println("   PASS: New project 'Selenium Test Project' created successfully!");
    }

    @Test(priority = 18, dependsOnMethods = "test17_CreateNewProjectSuccessfully")
    public void test18_NavigateToTasks() {
        // Find and click on the "Tasks" link in the sidebar or project card
        // Assuming after project creation we are on projects page, click on the project or tasks link
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        
        driver.get(BASE_URL + "/admin/tasks"); // Direct navigation for stability
        
        try {
           wait.until(ExpectedConditions.urlContains("/tasks"));
           System.out.println("   PASS: Navigated to Tasks page");
           
           // Select Project from Dropdown
           // Wait for dropdown to be visible
           try { Thread.sleep(1000); } catch (InterruptedException e) {}
           
           // Click the Select trigger
           WebElement projectSelect = wait.until(ExpectedConditions.elementToBeClickable(By.id("project-select")));
           projectSelect.click();
           
           // Click the project option "Selenium Test Project"
           // Material Tailwind renders options in a portal, often at the end of body
           // We look for an option with text "Selenium Test Project"
           WebElement projectOption = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//li[@role='option']//span[contains(text(), 'Selenium Test Project')] | //li[@role='option' and contains(text(), 'Selenium Test Project')]")));
           projectOption.click();
           System.out.println("   PASS: Selected 'Selenium Test Project'");
           
        } catch (Exception e) {
            Assert.fail("Failed to navigate to Tasks page or select project: " + e.getMessage());
        }
    }

    @Test(priority = 19, dependsOnMethods = "test18_NavigateToTasks")
    public void test19_CreateTask() {
        // Wait for columns to load
        try { Thread.sleep(1000); } catch (InterruptedException e) {}

        // 1. Check if any column exists. If not, create one.
        List<WebElement> columns = driver.findElements(By.xpath("//div[contains(@class, 'bg-white') or contains(@class, 'dark:bg-gray-500')]//div[text()]"));
        // Note: The above xpath is a guess based on Column.jsx structure. 
        // Better: Check for "Add Task" buttons.
        List<WebElement> addTaskButtons = driver.findElements(By.xpath("//button[starts-with(@id, 'add-task-btn-')]"));
        
        if (addTaskButtons.isEmpty()) {
            System.out.println("   ⚠️ No columns found. Creating 'To Do' column...");
            try {
                // Click "Add Column"
                driver.findElement(By.id("add-column-btn")).click();
                
                // Fill details
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("column-name"))).sendKeys("To Do");
                
                // Submit
                driver.findElement(By.id("column-submit")).click();
                
                // Wait for column to appear
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[starts-with(@id, 'add-task-btn-')]")));
                System.out.println("   PASS: Created 'To Do' column.");
                
            } catch (Exception e) {
                Assert.fail("Failed to create a column: " + e.getMessage());
            }
        }

        // 2. Click "Add Task" button in the first column
        try {
            WebElement addTaskBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[starts-with(@id, 'add-task-btn-')]")));
            addTaskBtn.click();
            System.out.println("   PASS: 'Add Task' dialog opened");
        } catch (Exception e) {
            Assert.fail("Could not find or click 'Add Task' button: " + e.getMessage());
        }

        // 3. Fill Task Form
        try {
            WebElement nameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("task-name")));
            nameInput.sendKeys("Selenium Automated Task");

            driver.findElement(By.id("task-description")).sendKeys("This task was created by Selenium automation.");

            // Priority
            driver.findElement(By.id("task-priority")).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//li[@role='option' and text()='High']"))).click();

            // Assignees - Select first available
            driver.findElement(By.id("task-assignees")).click();
            try { Thread.sleep(500); } catch (InterruptedException e) {}
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(@class, 'absolute')]//div[contains(@class, 'cursor-pointer')]"))).click();
            
            // Dependencies (Optional, skip)
            // Due Date
            WebElement dateInput = driver.findElement(By.id("task-due-date"));
            dateInput.sendKeys("12-31-2026"); // Try different date formats if needed, usually mm-dd-yyyy works for Selenium sendKeys on date inputs, or yyyy-mm-dd depending on locale. Chrome usually expects mm-dd-yyyy or yyyy-mm-dd keys.
            // Let's use yyyy-mm-dd which is standard ISO
            dateInput.clear();
            dateInput.sendKeys("2026-12-31"); 
            // If clear() doesn't work on date inputs sometimes, we might need keys.

            // Submit
            WebElement submitBtn = driver.findElement(By.id("task-submit"));
            submitBtn.click();
            
            // Wait for success toast
            WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(10));
            longWait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--success")));
            System.out.println("   PASS: Task created successfully!");

        } catch (Exception e) {
            Assert.fail("Failed to fill or submit task form: " + e.getMessage());
        }
    }

    @Test(priority = 20, dependsOnMethods = "test19_CreateTask")
    public void test20_NavigateToAnalytics() {
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        
        driver.get(BASE_URL + "/admin/analytics");
        
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("analytics-page")));
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("chart-tasks-per-column")));
            System.out.println("   PASS: Analytics page and charts loaded!");
        } catch (Exception e) {
            Assert.fail("Analytics page or charts failed to load: " + e.getMessage());
        }
    }
}
