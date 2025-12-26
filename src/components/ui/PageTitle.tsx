'use client';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const PageTitle = ({ title, subtitle, centered = true }: PageTitleProps) => {
  // const { t } = useTranslation(); // Removed unused hook
  
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h1 className="text-3xl font-bold text-text md:text-4xl lg:text-5xl"> {/* Removed dark:text-text */}
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-text-secondary md:text-xl"> {/* Removed dark:text-text-secondary */}
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
