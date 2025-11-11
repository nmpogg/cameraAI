import os
from typing import Sequence

def save_loss_plots(train_losses: Sequence[float], val_losses: Sequence[float], out_dir: str = "plots", prefix: str = "loss"):
	"""Save training and validation loss plots.

	This will create the output directory if it doesn't exist and save three files:
	  - train_loss.png       (training loss vs epoch)
	  - val_loss.png         (validation loss vs epoch)
	  - losses_combined.png  (both curves on the same plot)

	Args:
		train_losses: sequence of per-epoch training losses
		val_losses: sequence of per-epoch validation losses
		out_dir: directory where images will be saved
		prefix: optional prefix for filenames
	"""
	try:
		import matplotlib.pyplot as plt
	except Exception as e:
		raise RuntimeError("matplotlib is required to save plots. Install it with `pip install matplotlib`") from e

	os.makedirs(out_dir, exist_ok=True)

	epochs = list(range(1, max(len(train_losses), len(val_losses)) + 1))

	# Train loss
	if len(train_losses) > 0:
		plt.figure(figsize=(8, 4))
		plt.plot(range(1, len(train_losses) + 1), train_losses, marker='o', color='tab:blue')
		plt.title('Training Loss')
		plt.xlabel('Epoch')
		plt.ylabel('Loss')
		plt.grid(True, linestyle='--', alpha=0.4)
		train_path = os.path.join(out_dir, f"{prefix}_train.png")
		plt.tight_layout()
		plt.savefig(train_path)
		plt.close()

	# Validation loss
	if len(val_losses) > 0:
		plt.figure(figsize=(8, 4))
		plt.plot(range(1, len(val_losses) + 1), val_losses, marker='o', color='tab:orange')
		plt.title('Validation Loss')
		plt.xlabel('Epoch')
		plt.ylabel('Loss')
		plt.grid(True, linestyle='--', alpha=0.4)
		val_path = os.path.join(out_dir, f"{prefix}_val.png")
		plt.tight_layout()
		plt.savefig(val_path)
		plt.close()

	# Combined
	if len(train_losses) > 0 and len(val_losses) > 0:
		plt.figure(figsize=(8, 4))
		plt.plot(range(1, len(train_losses) + 1), train_losses, marker='o', label='train', color='tab:blue')
		plt.plot(range(1, len(val_losses) + 1), val_losses, marker='o', label='val', color='tab:orange')
		plt.title('Training and Validation Loss')
		plt.xlabel('Epoch')
		plt.ylabel('Loss')
		plt.legend()
		plt.grid(True, linestyle='--', alpha=0.4)
		comb_path = os.path.join(out_dir, f"{prefix}_combined.png")
		plt.tight_layout()
		plt.savefig(comb_path)
		plt.close()

	return {
		'train_path': train_path if len(train_losses) > 0 else None,
		'val_path': val_path if len(val_losses) > 0 else None,
		'combined_path': comb_path if (len(train_losses) > 0 and len(val_losses) > 0) else None,
	}

