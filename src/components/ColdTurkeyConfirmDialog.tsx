import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router-dom"

interface ColdTurkeyConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ColdTurkeyConfirmDialog({ isOpen, onClose }: ColdTurkeyConfirmDialogProps) {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate("/quit_progress")
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận Cold Turkey Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn bắt đầu kế hoạch Cold Turkey? 
            Đây là phương pháp cai thuốc đột ngột và cần sự quyết tâm cao.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Return</AlertDialogCancel>
          <AlertDialogAction onClick={handleEnter}>Enter</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}