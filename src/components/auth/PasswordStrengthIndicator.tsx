
import { validatePassword, getPasswordStrengthText, getPasswordStrengthColor } from '@/lib/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator = ({ password, className = "" }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const { score, feedback } = validatePassword(password);
  const strengthText = getPasswordStrengthText(score);
  const strengthColor = getPasswordStrengthColor(score);

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex items-center space-x-2 mb-1">
        <div className="flex-1 bg-gray-700 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${(score / 4) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          score <= 1 ? 'text-red-400' : 
          score === 2 ? 'text-yellow-400' : 
          score === 3 ? 'text-blue-400' : 'text-green-400'
        }`}>
          {strengthText}
        </span>
      </div>
      
      {feedback.length > 0 && (
        <ul className="text-xs text-gray-400 space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-400 mr-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
