import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Github, BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold gradient-text">
                Chat Docs!
              </span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm">
              AI-powered PDF document chat for effortless document interaction.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <ScrollLink
                  to="features" // The id of the target element
                  smooth={true} // Enables smooth scrolling
                  duration={500} // Duration of the scroll in milliseconds
                  className="text-base text-gray-600 hover:text-indigo-600 cursor-pointer focus:outline-none"
                >
                  Features
                </ScrollLink>
              </li>
              <li>
                {/* <Link to="#how-it-works" className="text-base text-gray-600 hover:text-indigo-600">
                  How It Works
                </Link> */}
                <ScrollLink
                  to="how-it-works" // The id of the target element
                  smooth={true} // Enables smooth scrolling
                  duration={500} // Duration of the scroll in milliseconds
                  className="text-base text-gray-600 hover:text-indigo-600 cursor-pointer focus:outline-none"
                >
                  How It Works
                </ScrollLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="https://github.com/renatosantosti/chat-docs"
                  className="text-base text-gray-600 hover:text-indigo-600"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="https://github.com/renatosantosti/chat-docs/issues"
                  className="text-base text-gray-600 hover:text-indigo-600"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/in/renato-santos-ti/"
                  className="text-base text-gray-600 hover:text-indigo-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-base text-gray-600 hover:text-indigo-600 cursor-pointer underline-offset-4 hover:underline focus:outline-none focus:underline">
                      Privacy Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-blue-600">
                        <AlertTriangle className="h-5 w-5" />
                        Privacy Policy
                      </DialogTitle>
                      <DialogDescription className="text-left space-y-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-orange-800 mb-2">
                                Educational Open Source Project
                              </h4>
                              <p className="text-orange-700 text-sm">
                                This is an educational open source project. We
                                do not collect, store, or process personal data
                                for commercial purposes.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-green-800 mb-2">
                                No Personal Data Collection
                              </h4>
                              <ul className="text-green-700 text-sm space-y-1">
                                <li>
                                  • We do not collect personal information
                                </li>
                                <li>• No user tracking or analytics</li>
                                <li>• No data sharing with third parties</li>
                                <li>• No marketing or promotional emails</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-red-800 mb-2">
                                Document Upload Warning
                              </h4>
                              <ul className="text-red-700 text-sm space-y-1">
                                <li>
                                  • <strong>No Data Guarantees:</strong>{" "}
                                  Documents may be processed and stored
                                  temporarily
                                </li>
                                <li>
                                  • <strong>Educational Use Only:</strong> Do
                                  not upload sensitive or personal documents
                                </li>
                                <li>
                                  • <strong>No Backup:</strong> Documents may be
                                  deleted without notice
                                </li>
                                <li>
                                  • <strong>Open Source:</strong> Code is public
                                  and may contain vulnerabilities
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-700 text-sm">
                            <strong>Important:</strong> This is an educational
                            project with no commercial privacy guarantees. Use
                            at your own risk and only with non-sensitive
                            documents.
                          </p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-base text-gray-600 hover:text-indigo-600 cursor-pointer underline-offset-4 hover:underline focus:outline-none focus:underline">
                      Terms of Service
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        Educational Project Notice
                      </DialogTitle>
                      <DialogDescription className="text-left space-y-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-orange-800 mb-2">
                                This is an Open Source Educational Project
                              </h4>
                              <p className="text-orange-700 text-sm">
                                ChatDocs is developed for educational purposes
                                and learning about AI-powered document
                                processing.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-red-800 mb-2">
                                Important Warnings
                              </h4>
                              <ul className="text-red-700 text-sm space-y-1">
                                <li>
                                  • <strong>No Long-term Support:</strong> This
                                  service may not be available permanently
                                </li>
                                <li>
                                  • <strong>No Data Guarantees:</strong> We
                                  cannot guarantee the security or permanence of
                                  your uploaded documents
                                </li>
                                <li>
                                  • <strong>Educational Use Only:</strong> Do
                                  not upload sensitive, confidential, or
                                  personal documents
                                </li>
                                <li>
                                  • <strong>No Service Level Agreement:</strong>{" "}
                                  No uptime or performance guarantees
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Github className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-800 mb-2">
                                Open Source
                              </h4>
                              <p className="text-blue-700 text-sm">
                                This project is open source and available for
                                learning, modification, and contribution. Feel
                                free to explore the codebase and contribute to
                                its development.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-700 text-sm">
                            <strong>
                              By using this service, you acknowledge and accept
                              these limitations.
                            </strong>
                            We recommend using this platform only for
                            educational purposes and non-sensitive documents.
                          </p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-base text-gray-600 hover:text-indigo-600 cursor-pointer underline-offset-4 hover:underline focus:outline-none focus:underline">
                      Cookie Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-green-600">
                        <AlertTriangle className="h-5 w-5" />
                        Cookie Policy
                      </DialogTitle>
                      <DialogDescription className="text-left space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-green-800 mb-2">
                                No Cookie Tracking
                              </h4>
                              <p className="text-green-700 text-sm">
                                This educational project does not use cookies
                                for tracking, analytics, or advertising
                                purposes.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-800 mb-2">
                                Essential Cookies Only
                              </h4>
                              <ul className="text-blue-700 text-sm space-y-1">
                                <li>
                                  • <strong>Authentication:</strong> Only for
                                  user login session management
                                </li>
                                <li>
                                  • <strong>Security:</strong> Essential for
                                  application security
                                </li>
                                <li>
                                  • <strong>No Tracking:</strong> We do not
                                  track user behavior
                                </li>
                                <li>
                                  • <strong>No Analytics:</strong> No Google
                                  Analytics or similar tools
                                </li>
                                <li>
                                  • <strong>No Advertising:</strong> No
                                  third-party advertising cookies
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-orange-800 mb-2">
                                Educational Project Disclaimer
                              </h4>
                              <p className="text-orange-700 text-sm">
                                As an educational open source project, we
                                prioritize simplicity and learning. Cookie usage
                                is minimal and limited to essential
                                functionality only.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-700 text-sm">
                            <strong>Note:</strong> This cookie policy applies to
                            the educational version of the application. If you
                            deploy your own instance, you may implement
                            additional cookie policies as needed.
                          </p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Chat Docs!. It´s a open source
            initiative.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
